import { fetchQuestions } from "../../api/questions";
import { ExamMode, ExamQuestion, ExamSession } from "./examTypes";

const API_BASE = "http://127.0.0.1:4000";

const CISA_WEIGHTS: Record<string, number> = {
  D1: 0.21, D2: 0.17, D3: 0.12, D4: 0.23, D5: 0.27,
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

function buildWeightedSelection(
  allQuestions: Awaited<ReturnType<typeof fetchQuestions>>,
  totalCount: number
) {
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

  if (selected.length < totalCount) {
    const selectedIds = new Set(selected.map((q) => q.id));
    const leftover = allQuestions.filter((q) => !selectedIds.has(q.id));
    selected.push(...pickRandom(leftover, totalCount - selected.length));
  }

  return shuffle(selected).slice(0, totalCount);
}

function toExamQuestion(q: Awaited<ReturnType<typeof fetchQuestions>>[number]): ExamQuestion {
  const choices = q.choices.map((c) => ({ id: c.id, label: c.label, text: c.text }));
  const correctChoice = q.choices.find((c) => c.isCorrect);
  const domainNum = parseInt(q.domain.replace("D", "")) || 1;
  return {
    id: q.id,
    domain: domainNum,
    ks: q.category,
    text: q.text,
    explanation: correctChoice?.justification ?? "",
    correctChoiceId: correctChoice?.id ?? choices[0]?.id ?? "",
    choices,
  };
}

export async function buildExamSession(args: {
  mode: ExamMode;
  domains: number[];
  count: number;
  minutes: number;
  mock?: number;
}): Promise<ExamSession> {
  const { mode, domains, count, minutes, mock } = args;

  // 1. Fetch all questions from API
  const allQuestions = await fetchQuestions();

  // 2. Build CISA-weighted selection client-side
  let selectedQuestions: typeof allQuestions;
  if (mock) {
    selectedQuestions = buildWeightedSelection(allQuestions, 150);
  } else {
    const domainEnums = domains.map((d) => DOMAIN_MAP[d]).filter(Boolean);
    const filtered = allQuestions.filter((q) => domainEnums.includes(q.domain));
    selectedQuestions = pickRandom(filtered, Math.min(count, filtered.length));
  }

  // 3. POST to API with the selected question IDs to create a DB-backed attempt
  const questionIds = selectedQuestions.map((q) => q.id);
  const res = await fetch(`${API_BASE}/attempts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      mode: "EXAM",
      durationSec: (mock ? 240 : minutes) * 60,
      questionIds,
    }),
  });

  if (!res.ok) throw new Error("Failed to create exam attempt");
  const data = await res.json();

  return {
    id: data.attemptId,
    createdAt: new Date().toISOString(),
    mode,
    domains,
    durationMinutes: mock ? 240 : minutes,
    questions: selectedQuestions.map(toExamQuestion),
  };
}

export function calcRemainingSeconds(startMs: number, totalSeconds: number) {
  const elapsed = Math.floor((Date.now() - startMs) / 1000);
  return Math.max(totalSeconds - elapsed, 0);
}
