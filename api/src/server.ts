import "dotenv/config";

import Fastify from "fastify";
import cors from "@fastify/cors";
import sensible from "@fastify/sensible";
import { PrismaClient } from "@prisma/client";

import { env } from "./config/env.js";
import { questionsRoutes } from "./routes/questions.js";

const app = Fastify({ logger: true });
const prisma = new PrismaClient();

await app.register(cors, { origin: true });
await app.register(sensible);
await app.register(questionsRoutes);

// ─── Health ───────────────────────────────────────────────────────────────────

app.get("/health", async () => ({ ok: true }));

// ─── Flashcards ───────────────────────────────────────────────────────────────

app.get("/flashcards", async () => {
  return prisma.flashcard.findMany({ orderBy: { id: "asc" } });
});

// ─── Game Scores ──────────────────────────────────────────────────────────────

app.get("/scores/:game", async (req) => {
  const { game } = req.params as { game: string };
  const scores = await prisma.gameScore.findMany({
    where: { game },
    orderBy: { score: "desc" },
    take: 10,
  });
  return { game, best: scores[0]?.score ?? 0, history: scores };
});

app.post("/scores/:game", async (req, reply) => {
  const { game } = req.params as { game: string };
  const { score } = req.body as { score: number };
  if (typeof score !== "number") return reply.badRequest("score must be a number");
  return prisma.gameScore.create({ data: { game, score } });
});

// ─── Attempts ─────────────────────────────────────────────────────────────────

app.get("/attempts", async (req) => {
  const { mode } = req.query as { mode?: string };
  return prisma.attempt.findMany({
    where: {
      submittedAt: { not: null },
      ...(mode && { mode: mode as any }),
    },
    orderBy: { submittedAt: "desc" },
    take: 50,
    select: {
      id: true,
      mode: true,
      score: true,
      total: true,
      percent: true,
      startedAt: true,
      submittedAt: true,
    },
  });
});

app.post("/attempts", async (req, reply) => {
  const { mode, domain, category, questionCount, durationSec } = req.body as {
    mode: "PRACTICE" | "EXAM" | "STUDY";
    domain?: string;
    category?: string;
    questionCount?: number;
    durationSec: number;
  };

  const ANON_USER_ID = "anon";
  await prisma.user.upsert({
    where: { id: ANON_USER_ID },
    create: { id: ANON_USER_ID, email: "anon@local", password: "none" },
    update: {},
  });

  const questions = await prisma.question.findMany({
    where: {
      active: true,
      ...(domain && { domain: domain as any }),
      ...(category && { category }),
    },
    include: { choices: { orderBy: { label: "asc" } } },
  });

  if (questions.length === 0) return reply.badRequest("No questions found");

  const shuffled = questions.sort(() => Math.random() - 0.5);
  const selected = questionCount ? shuffled.slice(0, questionCount) : shuffled;

  const attempt = await prisma.attempt.create({
    data: {
      userId: ANON_USER_ID,
      mode,
      durationSec,
      total: selected.length,
      questions: {
        create: selected.map((q, i) => ({ questionId: q.id, order: i + 1 })),
      },
      answers: {
        create: selected.map((q) => ({ questionId: q.id })),
      },
    },
  });

  return {
    attemptId: attempt.id,
    total: selected.length,
    questions: selected.map((q, i) => ({
      order: i + 1,
      id: q.id,
      domain: q.domain,
      category: q.category,
      text: q.text,
      choices: q.choices.map((c) => ({ label: c.label, text: c.text })),
    })),
  };
});

app.patch("/attempts/:id/answers/:questionId", async (req, reply) => {
  const { id, questionId } = req.params as { id: string; questionId: string };
  const { choiceLabel, flagged, timeSpentMs } = req.body as {
    choiceLabel?: string;
    flagged?: boolean;
    timeSpentMs?: number;
  };

  const attempt = await prisma.attempt.findUnique({ where: { id } });
  if (!attempt) return reply.notFound("Attempt not found");
  if (attempt.submittedAt) return reply.badRequest("Already submitted");

  let choiceId: string | undefined;
  if (choiceLabel) {
    const choice = await prisma.choice.findFirst({
      where: { questionId, label: choiceLabel },
    });
    choiceId = choice?.id;
  }

  return prisma.attemptAnswer.update({
    where: { attemptId_questionId: { attemptId: id, questionId } },
    data: {
      ...(choiceId !== undefined && { choiceId }),
      ...(flagged !== undefined && { flagged }),
      ...(timeSpentMs !== undefined && { timeSpentMs }),
      answeredAt: new Date(),
    },
  });
});

app.post("/attempts/:id/submit", async (req, reply) => {
  const { id } = req.params as { id: string };
  const attempt = await prisma.attempt.findUnique({
    where: { id },
    include: { answers: true },
  });
  if (!attempt) return reply.notFound("Attempt not found");
  if (attempt.submittedAt) return reply.badRequest("Already submitted");

  let correct = 0;
  for (const answer of attempt.answers) {
    if (!answer.choiceId) continue;
    const choice = await prisma.choice.findUnique({ where: { id: answer.choiceId } });
    if (choice?.isCorrect) correct++;
  }

  const total = attempt.answers.length;
  const percent = total > 0 ? Math.round((correct / total) * 100) : 0;

  const updated = await prisma.attempt.update({
    where: { id },
    data: { submittedAt: new Date(), score: correct, percent },
  });

  return { attemptId: id, score: correct, total, percent, submittedAt: updated.submittedAt };
});

app.get("/attempts/:id/results", async (req, reply) => {
  const { id } = req.params as { id: string };
  const attempt = await prisma.attempt.findUnique({
    where: { id },
    include: {
      questions: {
        orderBy: { order: "asc" },
        include: { question: { include: { choices: { orderBy: { label: "asc" } } } } },
      },
      answers: true,
    },
  });
  if (!attempt) return reply.notFound("Attempt not found");

  const answerMap = new Map(attempt.answers.map((a) => [a.questionId, a]));

  return {
    attemptId: id,
    mode: attempt.mode,
    score: attempt.score,
    total: attempt.total,
    percent: attempt.percent,
    startedAt: attempt.startedAt,
    submittedAt: attempt.submittedAt,
    questions: attempt.questions.map(({ question, order }) => {
      const answer = answerMap.get(question.id);
      const selectedChoice = question.choices.find((c) => c.id === answer?.choiceId);
      const correctChoice = question.choices.find((c) => c.isCorrect);
      return {
        order,
        id: question.id,
        domain: question.domain,
        category: question.category,
        text: question.text,
        choices: question.choices.map((c) => ({
          label: c.label,
          text: c.text,
          isCorrect: c.isCorrect,
          justification: c.justification,
        })),
        selectedLabel: selectedChoice?.label ?? null,
        correctLabel: correctChoice?.label ?? null,
        isCorrect: selectedChoice?.isCorrect ?? false,
        flagged: answer?.flagged ?? false,
      };
    }),
  };
});

// ─── Start ────────────────────────────────────────────────────────────────────

app.listen({ port: env.PORT, host: "0.0.0.0" }).then(() => {
  app.log.info(`API running on http://localhost:${env.PORT}`);
});
