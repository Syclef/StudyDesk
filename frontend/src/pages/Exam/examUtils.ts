/**
 * frontend/src/pages/Exam/examUtils.ts
 * Builds exam sessions using questions fetched from the API.
 */

import { fetchQuestions } from "../../api/questions";
import { ExamMode, ExamQuestion, ExamSession } from "./examTypes";

const API_BASE = "http://127.0.0.1:4000";

// CISA Official Domain Weights
const CISA_WEIGHTS: Record<string, number> = {
  D1: 0.21,
  D2: 0.17,
  D3: 0.12,
  D4: 0.23,
  D5: 0.27,
};

const DOMAIN_MAP: Record<number, string> = {
  1: "D1", 2: "D2", 3: "D3", 4: "D4", 5: "D5",
};

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickRandom<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, n);
}

function toExamQuestion(
  q: Awaited<ReturnType<typeof fetchQuestions>>[number]
): ExamQuestion {
  const choices = q.choices.map((c) => ({
    id: c.id,
    label: c.label,
    text: c.text,
  }));

  const correctChoice = q.choices.find((c) => c.isCorrect);
  const domainNum = parseInt(q.domain.replace("D", "")) || 1;

  return {
    id: q.id,
    domain: domainNum,
    ks: q.category,
    text: q.text,
    explanation: correctChoice?.justification ?? q.taskStatement ?? "",
    correctChoiceId: correctChoice?.id ?? choices[0]?.id ?? "",
    choices,
  };
}

function buildWeightedSelection(
  allQuestions: Awaited<ReturnType<typeof fetchQuestions>>,
  totalCount: number
): Awaited<ReturnType<typeof fetchQuestions>> {
  const byDomain: Record<string, typeof allQuestions> = {};
  for (const q of allQuestions) {
    if (!byDomain[q.domain]) byDomain[q.domain] = [];
    byDomain[q.domain].push(q);
  }

  const selected: typeof allQuestions = [];
  for (const [domain, weight] of Object.entries(CISA_WEIGHTS)) {
    const target = Math.round(totalCount * weight);
    const pool = byDomain[domain] ?? [];
    selected.push(...pickRandom(pool, Math.min(target, pool.length)));
  }

  // Pad if short due to rounding
  if (selected.length < totalCount) {
    const selectedIds = new Set(selected.map((q) => q.id));
    const leftover = allQuestions.filter((q) => !selectedIds.has(q.id));
    selected.push(...pickRandom(leftover, totalCount - selected.length));
  }

  return shuffle(selected).slice(0, totalCount);
}

export async function buildExamSession(args: {
  mode: ExamMode;
  domains: number[];
  count: number;
  minutes: number;
  mock?: number;
}): Promise<ExamSession> {
  const { mode, domains, count, minutes, mock } = args;

  const allQuestions = await fetchQuestions();

  let selected: typeof allQuestions;

  if (mock) {
    // Exam Set — 150 questions, CISA weighted
    selected = buildWeightedSelection(allQuestions, 150);
  } else {
    // Custom quiz — filter by domain
    const domainEnums = domains.map((d) => DOMAIN_MAP[d]).filter(Boolean);
    const filtered = allQuestions.filter((q) => domainEnums.includes(q.domain));
    selected = pickRandom(filtered, Math.min(count, filtered.length));
  }

  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    mode,
    domains,
    durationMinutes: mock ? 240 : minutes,
    questions: selected.map(toExamQuestion),
  };
}

export function calcRemainingSeconds(startMs: number, totalSeconds: number) {
  const elapsed = Math.floor((Date.now() - startMs) / 1000);
  return Math.max(totalSeconds - elapsed, 0);
}
