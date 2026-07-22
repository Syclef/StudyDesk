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
  return prisma.gameScore.create({ data: { id: `${game}-${Date.now()}`, game, score } });
});

// ─── Attempts ─────────────────────────────────────────────────────────────────

app.get("/attempts", async (req) => {
  const { mode } = req.query as { mode?: string };
  const rows = await prisma.attempt.findMany({
    where: {
      submittedAt: { not: null },
      ...(mode && { mode: mode as any }),
    },
    orderBy: { submittedAt: "desc" },
    take: 50,
    select: {
      id: true,
      mode: true,
      mockSlot: true,
      score: true,
      total: true,
      percent: true,
      startedAt: true,
      submittedAt: true,
      questions: {
        take: 1,
        select: { question: { select: { domain: true } } },
      },
    },
  });

  // Flatten the nested lookup into a simple `domain` field (Study sessions
  // are single-category, so the first question's domain represents the
  // whole session) — used to label Recent Activity like "D1 Quiz".
  return rows.map(({ questions, ...rest }) => ({
    ...rest,
    domain: questions[0]?.question.domain ?? null,
  }));
});

app.post("/attempts", async (req, reply) => {
  const { mode, domain, category, questionCount, durationSec, questionIds, mockSlot } = req.body as {
    mode: "PRACTICE" | "EXAM" | "STUDY";
    domain?: string;
    category?: string;
    questionCount?: number;
    durationSec: number;
    questionIds?: string[];
    mockSlot?: number;
  };

  const ANON_USER_ID = "anon";
  await prisma.user.upsert({
    where: { id: ANON_USER_ID },
    create: { id: ANON_USER_ID, email: "anon@local", password: "none" },
    update: {},
  });

  let selected: any[];
  
  if (questionIds && questionIds.length > 0) {
  selected = await prisma.question.findMany({
    where: { id: { in: questionIds }, active: true },
    include: { choices: { orderBy: { label: "asc" } } },
  });
  
  const idOrder = new Map(questionIds.map((id, i) => [id, i]));
  selected.sort((a: any, b: any) => (idOrder.get(a.id) ?? 0) - (idOrder.get(b.id) ?? 0));
} else {
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
  selected = questionCount ? shuffled.slice(0, questionCount) : shuffled;
}

if (selected.length === 0) return reply.badRequest("No questions found");

  const attempt = await prisma.attempt.create({
    data: {
      userId: ANON_USER_ID,
      mode,
      mockSlot,
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
      choices: q.choices.map((c: any) => ({ 
        id: c.id,
        label: c.label, 
        text: c.text,
        isCorrect: mode !== "EXAM" ? c.isCorrect : false,
        justification: mode !== "EXAM" ? c.justification : null,
      })),
    })),
  };
});

app.patch("/attempts/:id/answers/:questionId", async (req, reply) => {
  const { id, questionId } = req.params as { id: string; questionId: string };
  const { choiceLabel, choiceId: directChoiceId, flagged, timeSpentMs } = req.body as {
    choiceLabel?: string;
    choiceId?: string;
    flagged?: boolean;
    timeSpentMs?: number;
  };

  const attempt = await prisma.attempt.findUnique({ where: { id } });
  if (!attempt) return reply.notFound("Attempt not found");
  if (attempt.submittedAt) return reply.badRequest("Already submitted");

  let choiceId: string | undefined = directChoiceId;
  if (!choiceId && choiceLabel) {
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

// ─── Domain progress ─────────────────────────────────────────────────────────
// GET /progress/domains          → combined across Study + Practice + Exam
// GET /progress/domains?mode=X   → scoped to a single mode (e.g. Study-only,
//                                   used by "Current Study Plan" so it can't be
//                                   marked "in progress" by Practice/Exam activity)

app.get("/progress/domains", async (req, reply) => {
  try {
    const { mode } = req.query as { mode?: string };

    const questionCounts = await prisma.question.groupBy({
      by: ["domain"],
      where: { active: true },
      _count: { id: true },
    });

    // Practice counts progressively — an abandoned Practice set still counts
    // its already-answered questions, so quitting partway can correctly
    // surface a domain as weak rather than showing nothing at all. Study and
    // Exam still require a full submission (Exam mirrors the real exam:
    // a half-finished mock score isn't meaningful; Study sets are short
    // enough that finishing them is the norm).
    // Note: despite the name, this can include unsubmitted attempts —
    // specifically in-progress/abandoned Practice sessions (see OR clause above).
    const eligibleAttempts = await prisma.attempt.findMany({
      where: {
        OR: [
          { submittedAt: { not: null } },
          { mode: "PRACTICE" },
        ],
        ...(mode && { mode: mode as any }),
      },
      select: { id: true, submittedAt: true, startedAt: true },
    });
    const submittedAtById = new Map(eligibleAttempts.map((a) => [a.id, (a.submittedAt ?? a.startedAt).getTime()]));
    const submittedIds = eligibleAttempts.map((a) => a.id);

    // Pull every answered question (across Study/Practice/Exam), then keep
    // only the latest answer per question so repeat attempts on the same
    // question don't inflate coverage — this measures unique questions seen
    // and whether you currently get them right, not total repetitions.
    const answers = submittedIds.length === 0 ? [] : await prisma.attemptAnswer.findMany({
      where: {
        choiceId: { not: null },
        attemptId: { in: submittedIds },
      },
      select: {
        questionId: true,
        attemptId: true,
        choiceId: true,
        question: { select: { domain: true, choices: { select: { id: true, isCorrect: true } } } },
      },
    });

    answers.sort((a, b) => (submittedAtById.get(b.attemptId) ?? 0) - (submittedAtById.get(a.attemptId) ?? 0));

    const latestByQuestion = new Map<string, (typeof answers)[number]>();
    for (const a of answers) {
      if (!latestByQuestion.has(a.questionId)) {
        latestByQuestion.set(a.questionId, a);
      }
    }

    const stats: Record<string, { attempted: number; correct: number }> = {};
    for (const a of latestByQuestion.values()) {
      const d = a.question.domain;
      if (!stats[d]) stats[d] = { attempted: 0, correct: 0 };
      stats[d].attempted++;
      const isCorrect = a.question.choices.find((c) => c.id === a.choiceId)?.isCorrect ?? false;
      if (isCorrect) stats[d].correct++;
    }

    return questionCounts.map((qc) => ({
      domain: qc.domain,
      total: qc._count.id,
      attempted: stats[qc.domain]?.attempted ?? 0,
      correct: stats[qc.domain]?.correct ?? 0,
    }));
  } catch (err) {
    req.log.error(err);
    return reply.internalServerError("Failed to compute domain progress");
  }
});

// ─── Study streak (consecutive days with any submitted attempt) ────────────

app.get("/progress/streak", async (req, reply) => {
  try {
    const attempts = await prisma.attempt.findMany({
      where: { submittedAt: { not: null } },
      select: { submittedAt: true },
    });

    const activeDates = new Set(
      attempts.map((a) => a.submittedAt!.toISOString().slice(0, 10))
    );

    const today = new Date();
    const last7Days: { date: string; active: boolean }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      last7Days.push({ date: key, active: activeDates.has(key) });
    }

    // Count consecutive active days ending today; if today has no activity
    // yet, count back from yesterday instead (so the streak isn't zeroed
    // out just because you haven't studied yet today).
    let currentStreak = 0;
    const cursor = new Date(today);
    if (!activeDates.has(cursor.toISOString().slice(0, 10))) {
      cursor.setDate(cursor.getDate() - 1);
    }
    while (activeDates.has(cursor.toISOString().slice(0, 10))) {
      currentStreak++;
      cursor.setDate(cursor.getDate() - 1);
    }

    return { currentStreak, last7Days };
  } catch (err) {
    req.log.error(err);
    return reply.internalServerError("Failed to compute streak");
  }
});

// ─── Reset ─────────────────────────────────────────────────────────────────
app.delete("/attempts/exam", async (req, reply) => {
  await prisma.attemptAnswer.deleteMany({
    where: { attempt: { mode: "EXAM" } },
  });
  await prisma.attemptQuestion.deleteMany({
    where: { attempt: { mode: "EXAM" } },
  });
  await prisma.attempt.deleteMany({
    where: { mode: "EXAM" },
  });
  return { ok: true };
});

// ─── Start ────────────────────────────────────────────────────────────────────

app.listen({ port: env.PORT, host: "0.0.0.0" }).then(() => {
  app.log.info(`API running on http://localhost:${env.PORT}`);
});


