import { QUESTIONS } from "../../data/questions";
import { ExamMode, ExamQuestion, ExamSession } from "./examTypes";

function pickRandom<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

function toExamQuestion(q: any): ExamQuestion {
  // your bank uses:
  // q.id, q.domain, q.question, q.choices[A-D], q.answer, q.justification/taskStatement

  const choices = (q.choices || []).map((c: any, idx: number) => ({
    id: `${q.id}-${c.label ?? String.fromCharCode(65 + idx)}`,
    label: c.label ?? String.fromCharCode(65 + idx),
    text: c.text ?? "",
  }));

  // Find correct choice by label
  const correctLabel = q.answer; // ex: "A"
  const correctChoice =
    choices.find((c: any) => c.label === correctLabel) ?? choices[0];

  return {
    id: q.id,
    domain: q.domain,
    ks: q.knowledgeStatementId || q.knowledgeStatement || q.ks,
    text: q.question ?? q.text ?? "",
    explanation: q.justification || q.taskStatement || q.explanation || "",
    correctChoiceId: correctChoice.id,
    choices,
  };
}

export function buildExamSession(args: {
  mode: ExamMode;
  domains: number[];
  count: number;
  minutes: number;
}): ExamSession {
  const { mode, domains, count, minutes } = args;

  const filtered = QUESTIONS.filter((q: any) =>
    domains.includes(Number(q.domain))
  );

  const selected = pickRandom(filtered, Math.min(count, filtered.length)).map(
    toExamQuestion
  );

  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    mode,
    domains,
    durationMinutes: minutes,
    questions: selected,
  };
}

export function calcRemainingSeconds(startMs: number, totalSeconds: number) {
  const elapsed = Math.floor((Date.now() - startMs) / 1000);
  return Math.max(totalSeconds - elapsed, 0);
}
