import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DailyQuizModal from "./DailyQuizModal";
import HelpModal from "./HelpModal";
import AssessmentQuizModal, { type AssessmentPerDomain } from "./AssessmentQuizModal";
import InfoModal from "./InfoModal";
import { useTheme } from "../../utils/theme";
import { computeExamCycles } from "../../utils/examCycles";

const API_BASE = "http://127.0.0.1:4000";
const DEFAULT_EXAM_DATE = "2026-08-16";
const EXAM_DATE_KEY = "studydesk_exam_date";
const DAILY_QUIZ_KEY = "studydesk_daily_quiz_v1";
const DISPLAY_NAME_KEY = "studydesk_display_name";
const STUDY_PLAN_MODE_KEY = "studydesk_study_plan_mode";
const ASSESSMENT_KEY = "studydesk_assessment_result_v1";
const DOMAIN_CODES = ["D1", "D2", "D3", "D4", "D5"];

function todayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

// Deterministic-but-unpredictable pick: same domain all day (so it doesn't
// change on refresh or between Retakes), but the day-to-day sequence looks
// random rather than a visible D1→D2→D3→D4→D5→D1 cycle.
function pickDomainForDate(dateKey: string): string {
  let hash = 0;
  for (let i = 0; i < dateKey.length; i++) {
    hash = (hash * 31 + dateKey.charCodeAt(i)) >>> 0;
  }
  return DOMAIN_CODES[hash % DOMAIN_CODES.length];
}

const DOMAIN_NAMES: Record<string, string> = {
  D1: "Information System Auditing Process",
  D2: "Governance and Management of IT",
  D3: "IS Acquisition, Development & Implementation",
  D4: "IS Operations and Business Resilience",
  D5: "Protection of Information Assets",
};

// Distinct colors per domain — deliberately not a gradient/fade, since a
// lighter-to-darker scheme would visually suggest some domains matter less
// than others. All five carry real exam weight, just different amounts.
const DOMAIN_COLORS: Record<string, string> = {
  D1: "#0071e3", // blue
  D2: "#34c759", // green
  D3: "#ff9500", // orange
  D4: "#af52de", // purple
  D5: "#00b4d8", // teal
};

interface AttemptSummary {
  id: string;
  mode: string;
  mockSlot: number | null;
  domain: string | null;
  score: number | null;
  total: number | null;
  percent: number | null;
  startedAt: string;
  submittedAt: string | null;
}

interface DomainProgress {
  domain: string;
  total: number;
  attempted: number;
  correct: number;
}

interface CategorySummary {
  domain: string;
  categories: { name: string; count: number }[];
}

interface CategoryProgress {
  category: string;
  total: number;
  attempted: number;
  correct: number;
}

interface StreakData {
  currentStreak: number;
  last7Days: { date: string; active: boolean }[];
}

interface DailyQuizResult {
  date: string;
  domain: string;
  correct: number;
  total: number;
}

const S = {
  label: {
    fontSize: 11,
    fontWeight: 600,
    color: "var(--muted)",
    textTransform: "uppercase" as const,
    letterSpacing: "0.06em",
    marginBottom: 6,
  } as React.CSSProperties,
  value: {
    fontSize: 28,
    fontWeight: 700,
    color: "var(--text)",
    letterSpacing: "-0.5px",
    lineHeight: 1.1,
  } as React.CSSProperties,
  sub: {
    fontSize: 12,
    color: "var(--muted)",
    marginTop: 4,
  } as React.CSSProperties,
  card: {
    background: "var(--card-bg)",
    border: "1px solid var(--card-border)",
    borderRadius: 16,
    padding: "clamp(16px, 2.5vh, 26px) clamp(18px, 2.2vw, 30px)",
    display: "flex",
    flexDirection: "column" as const,
    boxShadow: "var(--shadow-sm)",
    minHeight: 0,
    minWidth: 0,
    overflow: "auto",
  } as React.CSSProperties,
  emptyState: {
    textAlign: "center" as const,
    padding: "14px 0 4px 0",
    color: "var(--muted)",
    fontSize: 12,
  } as React.CSSProperties,
  dot: (color: string): React.CSSProperties => ({
    display: "inline-block",
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: color,
    marginRight: 7,
  }),
};

// Circular progress ring — pure SVG, themed entirely via CSS variables so
// it renders correctly in both light and dark without extra work.
const ProgressRing: React.FC<{ pct: number; size?: number; label?: string }> = ({ pct, size = 140, label = "Readiness" }) => {
  const stroke = 10;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - pct / 100);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="var(--accent)" strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={circumference} strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 0.4s ease" }}
      />
      <text x="50%" y="47%" textAnchor="middle" dominantBaseline="middle" fontSize={size * 0.22} fontWeight={700} fill="var(--text)">
        {pct}%
      </text>
      <text x="50%" y="66%" textAnchor="middle" dominantBaseline="middle" fontSize={size * 0.09} fill="var(--muted)">
        {label}
      </text>
    </svg>
  );
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState<AttemptSummary[]>([]);
  const [domainProgress, setDomainProgress] = useState<DomainProgress[]>([]);
  const [examDomainProgress, setExamDomainProgress] = useState<DomainProgress[]>([]);
  const [studyDomainProgress, setStudyDomainProgress] = useState<DomainProgress[]>([]);
  const [practiceDomainProgress, setPracticeDomainProgress] = useState<DomainProgress[]>([]);
  const [categoriesByDomain, setCategoriesByDomain] = useState<CategorySummary[]>([]);
  const [categoryProgress, setCategoryProgress] = useState<CategoryProgress[]>([]);
  const [weakAreaPrompt, setWeakAreaPrompt] = useState<{
    domainCode: string;
    domainName: string;
    domainAcc: number | null;
    source: "study" | "practice" | "combined";
    categoryName: string;
    categoryAcc: number;
  } | null>(null);
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [dailyQuizResult, setDailyQuizResult] = useState<DailyQuizResult | null>(null);
  const [showDailyQuiz, setShowDailyQuiz] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { mode, toggle: toggleTheme } = useTheme();
  const [displayName] = useState(() => localStorage.getItem(DISPLAY_NAME_KEY) ?? "");
  const [studyPlanMode, setStudyPlanMode] = useState<"hybrid" | "adaptive">(
    () => (localStorage.getItem(STUDY_PLAN_MODE_KEY) as "hybrid" | "adaptive") ?? "hybrid"
  );
  const [showStudyPlanInfo, setShowStudyPlanInfo] = useState(false);
  const [showReadinessInfo, setShowReadinessInfo] = useState(false);
  const [showFocusAreasInfo, setShowFocusAreasInfo] = useState(false);
  const [showAssessment, setShowAssessment] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<{
    perDomain: Record<string, AssessmentPerDomain>;
    recommendedMode: "hybrid" | "adaptive";
  } | null>(() => {
    try {
      const raw = localStorage.getItem(ASSESSMENT_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [examDate, setExamDate] = useState(() => localStorage.getItem(EXAM_DATE_KEY) ?? DEFAULT_EXAM_DATE);
  const [editingDate, setEditingDate] = useState(false);
  const [tempDate, setTempDate] = useState(examDate);

  const todayDomain = pickDomainForDate(todayKey(new Date()));
  const todayDomainName = DOMAIN_NAMES[todayDomain];

  useEffect(() => {
    fetch(`${API_BASE}/attempts`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data: AttemptSummary[]) => { setAttempts(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));

    fetch(`${API_BASE}/progress/domains`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data: DomainProgress[]) => setDomainProgress(Array.isArray(data) ? data : []))
      .catch(() => setDomainProgress([]));

    // Exam-only view — Overall Readiness should reflect how you'd do under
    // real exam conditions specifically, not blended with untimed
    // Study/Practice performance (which tends to run higher).
    fetch(`${API_BASE}/progress/domains?mode=EXAM`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data: DomainProgress[]) => setExamDomainProgress(Array.isArray(data) ? data : []))
      .catch(() => setExamDomainProgress([]));

    // Study-only view — Current Study Plan should only reflect Study-module
    // activity, not Practice/Exam sessions that happened to touch the same
    // questions (those still count toward the combined Overall Progress above).
    fetch(`${API_BASE}/progress/domains?mode=STUDY`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data: DomainProgress[]) => setStudyDomainProgress(Array.isArray(data) ? data : []))
      .catch(() => setStudyDomainProgress([]));

    // Practice-only view — right half of Focus Areas.
    fetch(`${API_BASE}/progress/domains?mode=PRACTICE`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data: DomainProgress[]) => setPracticeDomainProgress(Array.isArray(data) ? data : []))
      .catch(() => setPracticeDomainProgress([]));

    // Domain → category mapping + per-category combined accuracy — used so
    // Focus Areas can jump directly into the single weakest category inside
    // a weak domain, instead of just landing you on the domain's full list.
    fetch(`${API_BASE}/categories`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data: CategorySummary[]) => setCategoriesByDomain(Array.isArray(data) ? data : []))
      .catch(() => setCategoriesByDomain([]));

    fetch(`${API_BASE}/progress/categories`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data: CategoryProgress[]) => setCategoryProgress(Array.isArray(data) ? data : []))
      .catch(() => setCategoryProgress([]));

    fetch(`${API_BASE}/progress/streak`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data: StreakData) => setStreak(data))
      .catch(() => setStreak(null));

    try {
      const raw = localStorage.getItem(DAILY_QUIZ_KEY);
      if (raw) {
        const parsed: DailyQuizResult = JSON.parse(raw);
        if (parsed.date === todayKey(new Date())) setDailyQuizResult(parsed);
      }
    } catch {
      // ignore malformed localStorage data
    }
  }, []);

  const handleDailyQuizComplete = (correct: number, total: number) => {
    const result: DailyQuizResult = { date: todayKey(new Date()), domain: todayDomain, correct, total };
    localStorage.setItem(DAILY_QUIZ_KEY, JSON.stringify(result));
    setDailyQuizResult(result);
    setShowDailyQuiz(false);
  };

  const handleAssessmentComplete = (perDomain: Record<string, AssessmentPerDomain>) => {
    const pcts = Object.values(perDomain)
      .filter(d => d.total > 0)
      .map(d => (d.correct / d.total) * 100);
    const spread = pcts.length > 0 ? Math.max(...pcts) - Math.min(...pcts) : 0;
    // Wide spread between your strongest and weakest domain → there's a real
    // gap worth targeting directly (Adaptive). Fairly even scores → order
    // matters less than just covering everything (Hybrid).
    const recommendedMode: "hybrid" | "adaptive" = spread > 25 ? "adaptive" : "hybrid";

    const result = { perDomain, recommendedMode };
    localStorage.setItem(ASSESSMENT_KEY, JSON.stringify(result));
    setAssessmentResult(result);
    setStudyPlanMode(recommendedMode);
    localStorage.setItem(STUDY_PLAN_MODE_KEY, recommendedMode);
    setShowAssessment(false);
  };

  // Deep-link into Study for a specific domain — expands that domain's
  // section and scrolls to it (StudyPage reads these sessionStorage keys
  // on mount), instead of just dumping the user on the generic Study page.
  const goToStudyDomain = (code: string) => {
    sessionStorage.setItem("study_open_domains", JSON.stringify([code]));
    sessionStorage.setItem("study_scroll_target", code);
    navigate("/study");
  };

  // Focus Areas points at a real, known weak spot — so clicking it should
  // jump straight into studying the single weakest category, not just land
  // on the domain's full category list (that's what Current Study Plan is
  // for, since it's about coverage, not a specific known weakness). Uses
  // the same priority logic as StudyPage's own sort, so the category chosen
  // here is exactly the one that would show "Focus here" if you browsed in.
  const goToWeakestCategoryInDomain = (code: string, source: "study" | "practice" | "combined" = "combined") => {
    const domainCategories = categoriesByDomain.find(c => c.domain === code)?.categories ?? [];
    if (domainCategories.length === 0) {
      goToStudyDomain(code); // no category data yet — fall back to browsing
      return;
    }

    const priority = (cat: { name: string }) => {
      const p = categoryProgress.find(c => c.category === cat.name);
      const acc = p && p.attempted > 0 ? (p.correct / p.attempted) * 100 : null;
      if (acc === null) return 1000;
      if (acc < 75) return acc;
      return 2000 + acc;
    };
    const sorted = [...domainCategories].sort((a, b) => priority(a) - priority(b));
    const weakest = sorted[0];
    const weakestPriority = priority(weakest);

    if (weakestPriority >= 75) {
      // Nothing genuinely weak yet (all untried or all strong) — browsing
      // the domain makes more sense than jumping into an arbitrary category.
      goToStudyDomain(code);
      return;
    }

    const domainInfo = source === "study" ? studyDomainRows.find(d => d.code === code)
      : source === "practice" ? practiceDomainRows.find(d => d.code === code)
      : domainRows.find(d => d.code === code);
    setWeakAreaPrompt({
      domainCode: code,
      domainName: domainInfo?.name ?? code,
      domainAcc: domainInfo?.acc ?? null,
      source,
      categoryName: weakest.name,
      categoryAcc: Math.round(weakestPriority),
    });
  };

  const saveDate = () => {
    if (!tempDate) return;
    localStorage.setItem(EXAM_DATE_KEY, tempDate);
    setExamDate(tempDate);
    setEditingDate(false);
  };

  // Note: name-editing UI removed per reference image (header should only
  // show help + settings icons). displayName still personalizes the greeting;
  // setting it will be re-added once Settings is built.

  // ── Metrics ─────────────────────────────────────────────────
  const now = new Date();
  const exam = new Date(examDate);
  const daysLeft = Math.max(Math.ceil((exam.getTime() - now.getTime()) / 86400000), 0);
  const submitted = attempts.filter(a => a.submittedAt);
  // Overall Readiness (the ring) — the PASS RATE across your most recently
  // COMPLETED CYCLE: one attempt on each of the 5 distinct Exam Sets. This
  // maps directly onto the app's real content (there are exactly 5 Exam
  // Sets), so "100%" means a genuine, complete claim — you passed every
  // mock exam this app offers, not just some arbitrary sample of attempts.
  // Retaking a set before finishing a cycle replaces that set's score for
  // the cycle (same shared logic used to lock/warn on the Exam page), so
  // cramming retakes can't inflate or corrupt the count. Uses an average
  // instead of a per-question blend for the same reason as before: two
  // strong attempts can't hide three weak ones, and all-time performance
  // can't be stuck by early struggling attempts once a clean cycle happens.
  const examOnlyForReadiness = submitted
    .filter(a => a.mode === "EXAM" && a.percent !== null)
    .map(a => ({ id: a.id, mockSlot: a.mockSlot, percent: a.percent, submittedAt: a.submittedAt }));
  const { completedCycles } = computeExamCycles(examOnlyForReadiness);
  const examAttemptsForReadiness = completedCycles.length > 0 ? completedCycles[completedCycles.length - 1] : null;
  const examPassedCount = examAttemptsForReadiness?.passedCount ?? 0;
  const overallAccuracy = examAttemptsForReadiness ? Math.round((examPassedCount / 5) * 100) : 0;

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  // ── Domain breakdown data (combining Study + Practice + Exam) — feeds
  //    Focus Areas and Current Study Plan's coverage logic ──
  const domainRows = useMemo(() => {
    return Object.entries(DOMAIN_NAMES).map(([code, name]) => {
      const d = domainProgress.find(dp => dp.domain === code);
      const total = d?.total ?? 0;
      const attempted = d?.attempted ?? 0;
      const correct = d?.correct ?? 0;
      const pct = total > 0 ? Math.min(Math.round((attempted / total) * 100), 100) : 0;
      const acc = attempted > 0 ? Math.round((correct / attempted) * 100) : null;
      return { code, name, pct, acc, attempted, total };
    });
  }, [domainProgress]);

  // Exam-only domain rows — feeds the Overall Readiness legend specifically,
  // kept separate from the combined domainRows above.
  const examDomainRows = useMemo(() => {
    return Object.entries(DOMAIN_NAMES).map(([code, name]) => {
      const d = examDomainProgress.find(dp => dp.domain === code);
      const attempted = d?.attempted ?? 0;
      const correct = d?.correct ?? 0;
      const acc = attempted > 0 ? Math.round((correct / attempted) * 100) : null;
      return { code, name, acc };
    });
  }, [examDomainProgress]);

  // Focus Areas — domains that are ACTUALLY weak (below 60%, matching the
  // red/amber/green convention used elsewhere on this dashboard), not just
  // "whichever 2 happen to be lowest." A domain barely below 60% still shows
  // up here; a domain solidly above it won't, no matter how it ranks
  // relative to the others. Uses the combined Study+Practice+Exam data (not
  // Exam-only) so this still works for anyone who skips Practice entirely.
  const WEAK_THRESHOLD = 75;

  // Study-only domain view — Current Study Plan must reflect Study-module
  // activity specifically, not Practice/Exam sessions touching the same
  // questions (those still count toward the combined stats above).
  const studyDomainRows = useMemo(() => {
    return Object.entries(DOMAIN_NAMES).map(([code, name]) => {
      const d = studyDomainProgress.find(dp => dp.domain === code);
      const total = d?.total ?? 0;
      const attempted = d?.attempted ?? 0;
      const correct = d?.correct ?? 0;
      const acc = attempted > 0 ? Math.round((correct / attempted) * 100) : null;
      return { code, name, attempted, total, acc };
    });
  }, [studyDomainProgress]);

  const practiceDomainRows = useMemo(() => {
    return Object.entries(DOMAIN_NAMES).map(([code, name]) => {
      const d = practiceDomainProgress.find(dp => dp.domain === code);
      const attempted = d?.attempted ?? 0;
      const correct = d?.correct ?? 0;
      const acc = attempted > 0 ? Math.round((correct / attempted) * 100) : null;
      return { code, name, attempted, acc };
    });
  }, [practiceDomainProgress]);

  // Focus Areas, split by module: left = Study-only weak domains, right =
  // Practice-only. A domain with zero attempts counts as weak here too —
  // untried means you're not passing it, same as a real 0% would. Untried
  // domains sort to the very top (most urgent — you haven't even started).
  const studyFocusAreas = useMemo(() => {
    return studyDomainRows
      .filter(d => d.acc === null || d.acc < WEAK_THRESHOLD)
      .sort((a, b) => (a.acc ?? -1) - (b.acc ?? -1));
  }, [studyDomainRows]);

  const practiceFocusAreas = useMemo(() => {
    return practiceDomainRows
      .filter(d => d.acc === null || d.acc < WEAK_THRESHOLD)
      .sort((a, b) => (a.acc ?? -1) - (b.acc ?? -1));
  }, [practiceDomainRows]);

  // Current Study Plan — two selectable strategies:
  // - "hybrid" (default): recommend domains you haven't touched yet first
  //   (build breadth), then once every domain has some coverage, switch to
  //   recommending your weakest-accuracy domains (reinforce what's shaky).
  // - "adaptive": always recommend weakest-accuracy domains first, regardless
  //   of coverage — domains with no data yet fill any remaining slots.
  // On first load with zero Study activity, everything is "Not Started" in
  // both modes — expected, not a bug.
  const studyPlan = useMemo(() => {
    const withStatus = studyDomainRows.map(d => {
      const status: "Not Started" | "In Progress" | "Completed" =
        d.attempted === 0 ? "Not Started" : d.attempted >= d.total && d.total > 0 ? "Completed" : "In Progress";
      return { ...d, status };
    });
    const notCompleted = withStatus.filter(d => d.status !== "Completed");

    if (studyPlanMode === "adaptive") {
      const withAcc = notCompleted.filter(d => d.acc !== null).sort((a, b) => (a.acc ?? 0) - (b.acc ?? 0));
      const withoutAcc = notCompleted.filter(d => d.acc === null);
      return [...withAcc, ...withoutAcc].slice(0, 2);
    }

    // hybrid
    const notStarted = notCompleted.filter(d => d.status === "Not Started");
    if (notStarted.length > 0) return notStarted.slice(0, 2);
    const started = notCompleted.filter(d => d.acc !== null).sort((a, b) => (a.acc ?? 0) - (b.acc ?? 0));
    return started.slice(0, 2);
  }, [studyDomainRows, studyPlanMode]);

  return (
    <div style={{
      height: "100vh",
      overflow: "hidden",
      padding: "clamp(10px, 2vh, 28px) clamp(20px, 4vw, 64px) clamp(14px, 2.5vh, 40px)",
      color: "var(--text)",
      boxSizing: "border-box",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
      display: "flex",
      flexDirection: "column",
      gap: "clamp(8px, 1.5vh, 18px)",
      width: "100%",
    }}>

      {/* ── Top bar: help · settings (icon-only, per reference image) ── */}
      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 10, flexShrink: 0 }}>
        <button onClick={() => setShowHelp(true)} title="How this works"
          style={{
            width: 26, height: 26, borderRadius: "50%",
            border: "1px solid var(--border)", background: "none", color: "var(--muted)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 700, cursor: "pointer",
          }}>
          ?
        </button>
        <div style={{ position: "relative" }}>
          <button onClick={() => setShowSettings(v => !v)} title="Settings"
            style={{
              width: 26, height: 26, borderRadius: "50%",
              border: "1px solid var(--border)", background: "none", color: "var(--muted)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
            }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
          {showSettings && (
            <div style={{
              position: "absolute", top: 32, right: 0, zIndex: 30, width: 190,
              background: "var(--card-bg)", border: "1px solid var(--card-border)",
              borderRadius: 12, boxShadow: "var(--shadow)", padding: 12,
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, color: "var(--text)", fontWeight: 500 }}>
                  {mode === "dark" ? "Dark mode" : "Light mode"}
                </span>
                <button onClick={toggleTheme}
                  style={{
                    width: 26, height: 26, borderRadius: 6,
                    border: "1px solid var(--border)", background: "transparent", color: "var(--muted)",
                    display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                  }}>
                  {mode === "dark" ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
                  )}
                </button>
              </div>
              <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 8 }}>More settings coming soon.</div>
            </div>
          )}
        </div>
      </div>

      {/* ── Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, letterSpacing: "-0.3px", color: "var(--text)" }}>
            Good {now.getHours() < 12 ? "morning" : now.getHours() < 17 ? "afternoon" : "evening"}{displayName ? `, ${displayName}` : ""} 👋
          </h1>
          <p style={{ fontSize: 13, color: "var(--muted)", margin: "3px 0 0 0" }}>
            CISA Exam: <strong style={{ color: daysLeft <= 14 && daysLeft > 0 ? "var(--danger)" : "var(--text)", fontWeight: 700 }}>{daysLeft} days left</strong>
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {editingDate ? (
            <>
              <input type="date" value={tempDate} onChange={e => setTempDate(e.target.value)}
                style={{ fontSize: 13, padding: "4px 8px", borderRadius: 6, border: "1px solid var(--input-border)", background: "var(--input-bg)", color: "var(--text)" }} />
              <button onClick={saveDate} style={{ background: "var(--accent)", color: "#fff", border: "none", borderRadius: 6, padding: "4px 10px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Save</button>
              <button onClick={() => { setTempDate(examDate); setEditingDate(false); }} style={{ background: "none", color: "var(--muted)", border: "1px solid var(--border)", borderRadius: 6, padding: "4px 8px", fontSize: 13, cursor: "pointer" }}>Cancel</button>
            </>
          ) : (
            <>
              <span style={{ fontSize: 13, color: "var(--muted)" }}>
                Exam date: <strong style={{ color: "var(--text)", fontWeight: 600 }}>{formatDate(examDate)}</strong>
              </span>
              <button onClick={() => { setTempDate(examDate); setEditingDate(true); }}
                style={{ background: "none", border: "1px solid var(--border)", borderRadius: 6, padding: "3px 8px", fontSize: 13, color: "var(--muted)", cursor: "pointer" }}>
                Edit
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── Study Plan / Progress / Streak / Daily Quiz — matches the reference
           image's asymmetric grid: Study Plan spans both rows on the left;
           Daily Quiz sits directly under Study Streak, not beside it ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gridTemplateRows: "1fr 1fr",
        gridTemplateAreas: `"plan progress streak" "plan progress dailyquiz"`,
        gap: 16,
        flex: 3,
        minHeight: 0,
      }}>

        {/* Current Study Plan — gated behind the one-time assessment, which
             determines whether Hybrid or Adaptive drives the recommendations */}
        <div style={{ ...S.card, gridArea: "plan" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
            <div style={S.label}>Current Study Plan</div>

            {assessmentResult && (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button
                  onClick={() => setShowStudyPlanInfo(true)}
                  title="What do Hybrid and Adaptive mean?"
                  style={{
                    width: 18, height: 18, borderRadius: "50%", border: "1.5px solid var(--muted)",
                    background: "none", color: "var(--muted)", fontSize: 11, fontWeight: 700,
                    display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: 0,
                    lineHeight: 1, fontStyle: "italic" as const, fontFamily: "Georgia, serif",
                  }}>
                  i
                </button>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3 }}>
                  <div style={{ display: "flex", border: "1px solid var(--border)", borderRadius: 999, padding: 2 }}>
                    {(["hybrid", "adaptive"] as const).map(mode => (
                      <button key={mode}
                        onClick={() => { setStudyPlanMode(mode); localStorage.setItem(STUDY_PLAN_MODE_KEY, mode); }}
                        style={{
                          border: "none", borderRadius: 999, padding: "3px 10px", fontSize: 10, fontWeight: 600,
                          cursor: "pointer", textTransform: "capitalize" as const,
                          background: studyPlanMode === mode ? "var(--accent)" : "transparent",
                          color: studyPlanMode === mode ? "#fff" : "var(--muted)",
                        }}>
                        {mode}
                      </button>
                    ))}
                  </div>
                  <span style={{ fontSize: 9, color: "var(--muted)" }}>
                    Suggested: <strong style={{ textTransform: "capitalize" as const }}>{assessmentResult.recommendedMode}</strong>
                  </span>
                </div>
              </div>
            )}
          </div>

          <div style={{ flex: 1, display: "flex", marginTop: 12, minHeight: 0 }}>
            {!assessmentResult ? (
              <div style={{
                flex: 1, borderRadius: 14,
                background: "var(--accent-light, rgba(0,113,227,0.08))", border: "1px solid var(--accent)",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                gap: 16, padding: "24px", textAlign: "center" as const,
              }}>
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 11l3 3L22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
                <span style={{ fontSize: 15, color: "var(--text)", lineHeight: 1.6, maxWidth: 280 }}>
                  Take a quick 25-question assessment so we can build a study plan around how you're actually doing.
                </span>
                <button onClick={() => setShowAssessment(true)}
                  style={{ background: "var(--accent)", color: "#fff", border: "none", borderRadius: 9, padding: "11px 24px", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
                  Take Assessment
                </button>
              </div>
            ) : studyPlan.length > 0 ? (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-around", gap: 12 }}>
                {studyPlan.map(d => (
                  <div key={d.code}
                    onClick={() => goToStudyDomain(d.code)}
                    style={{
                      flex: 1, display: "flex", flexDirection: "column", justifyContent: "center",
                      padding: "16px 20px", borderRadius: 12, cursor: "pointer",
                      background: "var(--panel-2, var(--card-bg))", border: "1px solid var(--card-border)",
                    }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>{d.code}: {d.name}</div>
                    <div style={{
                      display: "inline-block", marginTop: 9, fontSize: 12, fontWeight: 700, width: "fit-content",
                      padding: "4px 12px", borderRadius: 999,
                      color: d.status === "In Progress" ? "var(--warning,#ff9500)" : "var(--muted)",
                      background: d.status === "In Progress" ? "rgba(255,149,0,0.12)" : "var(--border)",
                    }}>
                      {d.status}{d.acc !== null ? ` · ${d.acc}%` : ""}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                gap: 12, borderRadius: 14, background: "var(--panel-2, var(--card-bg))", border: "1px solid var(--card-border)",
              }}>
                <span style={{ fontSize: 32 }}>🎉</span>
                <div style={{ ...S.emptyState, fontSize: 15, padding: 0 }}>You've covered every domain at least once.</div>
              </div>
            )}
          </div>
        </div>

        {/* Overall Progress — ring + domain legend beside it */}
        <div style={{ ...S.card, gridArea: "progress" }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
              <ProgressRing pct={loading ? 0 : overallAccuracy} size={185} label="Pass Rate" />
              <div style={{ flex: 1, minWidth: 0, height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ ...S.label, fontSize: 12 }}>Overall Readiness</div>
                  <button
                    onClick={() => setShowReadinessInfo(true)}
                    title="What does Overall Readiness measure?"
                    style={{
                      width: 18, height: 18, borderRadius: "50%", border: "1.5px solid var(--muted)",
                      background: "none", color: "var(--muted)", fontSize: 11, fontWeight: 700,
                      display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: 0,
                      lineHeight: 1, fontStyle: "italic" as const, fontFamily: "Georgia, serif",
                    }}>
                    i
                  </button>
                </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-around", marginTop: 10, maxHeight: 185 }}>
                {examDomainRows.map((d) => (
                  <div key={d.code} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 14 }}>
                    <span style={{ display: "flex", alignItems: "center", color: "var(--muted)" }}>
                      <span style={S.dot(DOMAIN_COLORS[d.code])} />
                      Domain {d.code.replace("D", "")}
                    </span>
                    <span style={{
                      fontWeight: 600,
                      color: d.acc === null ? "var(--muted)"
                        : d.acc < 60 ? "var(--danger,#ff3b30)"
                        : d.acc < 75 ? "var(--warning,#ff9500)"
                        : "var(--success,#34c759)",
                    }}>
                      {d.acc !== null ? `${d.acc}%` : "—"}
                    </span>
                  </div>
                ))}
              </div>
              </div>
            </div>
            {examAttemptsForReadiness ? (
              <div style={{ fontSize: 12, color: "var(--muted)" }}>
                {examPassedCount}/5 Exam Sets passed last cycle
              </div>
            ) : (
              <div style={{ fontSize: 12, color: "var(--muted)" }}>
                Complete all 5 Exam Sets once to see your first readiness score
              </div>
            )}
          </div>
        </div>

        {/* Study Streak */}
        <div style={{ ...S.card, gridArea: "streak" }}>
          <div style={S.label}>Study Streak</div>
          <div style={{ ...S.value, color: streak && streak.currentStreak > 0 ? "var(--accent)" : "var(--text)" }}>
            {streak ? `${streak.currentStreak} Day Streak!` : "—"}
          </div>
          {streak && (
            <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
              {streak.last7Days.map((d) => {
                const label = new Date(d.date + "T00:00:00").toLocaleDateString("en-US", { weekday: "narrow" });
                return (
                  <div key={d.date} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: "50%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: d.active ? "var(--accent)" : "var(--border)",
                      color: d.active ? "#fff" : "var(--muted)",
                      fontSize: 11, fontWeight: 700,
                    }}>
                      {d.active ? "✓" : "·"}
                    </div>
                    <span style={{ fontSize: 9, color: "var(--muted)" }}>{label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Daily Quiz — sits under Study Streak, matching the reference image */}
        <div style={{ ...S.card, gridArea: "dailyquiz", justifyContent: "center" }}>
          <div style={S.label}>Daily Quiz</div>
          <div style={{ fontSize: 12, color: "var(--muted)", margin: "2px 0 20px 0" }}>
            Today's topic: <strong style={{ color: "var(--text)" }}>{todayDomainName}</strong> · 10 Questions
          </div>
          {dailyQuizResult ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, color: "var(--success,#34c759)", fontWeight: 600 }}>
                ✓ Completed — {dailyQuizResult.correct}/{dailyQuizResult.total}
              </span>
              <button onClick={() => setShowDailyQuiz(true)}
                style={{ background: "none", border: "1px solid var(--border)", borderRadius: 8, padding: "6px 14px", fontSize: 12, color: "var(--muted)", cursor: "pointer" }}>
                Retake
              </button>
            </div>
          ) : (
            <button onClick={() => setShowDailyQuiz(true)}
              style={{ background: "var(--accent)", color: "#fff", border: "none", borderRadius: 8, padding: "8px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", width: "100%" }}>
              Take Today's Challenge
            </button>
          )}
        </div>
      </div>

      {/* ── Row 2: Focus Areas — split by module: Study (left) vs Practice (right) ── */}
      <div style={{ ...S.card, flex: 2.8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={S.label}>Focus Areas</div>
          <button
            onClick={() => setShowFocusAreasInfo(true)}
            title="What are Focus Areas?"
            style={{
              width: 18, height: 18, borderRadius: "50%", border: "1.5px solid var(--muted)",
              background: "none", color: "var(--muted)", fontSize: 11, fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: 0,
              lineHeight: 1, fontStyle: "italic" as const, fontFamily: "Georgia, serif",
            }}>
            i
          </button>
        </div>
        <div style={{ fontSize: 12, color: "var(--muted)", margin: "4px 0 16px 0" }}>
          Once you've studied, take an <strong style={{ color: "var(--text)" }}>Exam Set</strong> to see it reflected in Overall Readiness above.
        </div>
        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, minHeight: 0 }}>

          {/* Left: Study */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: 12 }}>
              Study
            </div>
            <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
              {studyFocusAreas.length > 0 ? (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-start", gap: 10 }}>
                  {studyFocusAreas.map(d => (
                    <div key={d.code} onClick={() => goToWeakestCategoryInDomain(d.code, "study")} style={{ cursor: "pointer" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                        <span style={{ color: "var(--text)" }}>
                          <span style={{ color: "var(--muted)", fontWeight: 600, marginRight: 8 }}>{d.code}</span>
                          {d.name}
                        </span>
                        <span style={{ fontWeight: 600, color: d.acc === null ? "var(--danger,#ff3b30)" : d.acc >= 60 ? "var(--warning,#ff9500)" : "var(--danger,#ff3b30)" }}>
                          {d.acc === null ? "Not attempted" : `${d.acc}%`}
                        </span>
                      </div>
                      <div style={{ height: 5, borderRadius: 999, background: "var(--border)", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${d.acc ?? 0}%`, background: d.acc === null ? "var(--danger,#ff3b30)" : d.acc >= 60 ? "var(--warning,#ff9500)" : "var(--danger,#ff3b30)", borderRadius: 999 }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  gap: 10, borderRadius: 14, background: "var(--panel-2, var(--card-bg))", border: "1px solid var(--card-border)",
                }}>
                  <span style={{ fontSize: 22 }}>🎉</span>
                  <div style={{ ...S.emptyState, fontSize: 13, padding: 0 }}>You're at {WEAK_THRESHOLD}%+ on every domain in Study.</div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Practice */}
          <div style={{ borderLeft: "1px solid var(--border)", paddingLeft: 28, display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: 12 }}>
              Practice
            </div>
            <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
              {practiceFocusAreas.length > 0 ? (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-start", gap: 10 }}>
                  {practiceFocusAreas.map(d => (
                    <div key={d.code} onClick={() => goToWeakestCategoryInDomain(d.code, "practice")} style={{ cursor: "pointer" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                        <span style={{ color: "var(--text)" }}>
                          <span style={{ color: "var(--muted)", fontWeight: 600, marginRight: 8 }}>{d.code}</span>
                          {d.name}
                        </span>
                        <span style={{ fontWeight: 600, color: d.acc === null ? "var(--danger,#ff3b30)" : d.acc >= 60 ? "var(--warning,#ff9500)" : "var(--danger,#ff3b30)" }}>
                          {d.acc === null ? "Not attempted" : `${d.acc}%`}
                        </span>
                      </div>
                      <div style={{ height: 5, borderRadius: 999, background: "var(--border)", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${d.acc ?? 0}%`, background: d.acc === null ? "var(--danger,#ff3b30)" : d.acc >= 60 ? "var(--warning,#ff9500)" : "var(--danger,#ff3b30)", borderRadius: 999 }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  gap: 10, borderRadius: 14, background: "var(--panel-2, var(--card-bg))", border: "1px solid var(--card-border)",
                }}>
                  <span style={{ fontSize: 22 }}>🎉</span>
                  <div style={{ ...S.emptyState, fontSize: 13, padding: 0 }}>You're at {WEAK_THRESHOLD}%+ on every domain in Practice.</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>


      {showDailyQuiz && (
        <DailyQuizModal
          domain={todayDomain}
          domainName={todayDomainName}
          onComplete={handleDailyQuizComplete}
          onClose={() => setShowDailyQuiz(false)}
        />
      )}

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}

      {showStudyPlanInfo && (
        <InfoModal title="Current Study Plan" onClose={() => setShowStudyPlanInfo(false)}>
          <p style={{ margin: "0 0 14px 0" }}>
            Domains you <strong>haven't finished covering yet in Study</strong> — based only on Study-module
            coverage, not how well you're scoring elsewhere. Once a domain is fully covered, it drops off this
            list for good, even if you're still getting it wrong in Practice or Exam (that's what Focus Areas
            is for).
          </p>
          <p style={{ margin: "0 0 14px 0" }}>
            <strong>Hybrid:</strong> unstudied domains first, then your weakest once everything's been touched.
          </p>
          <p style={{ margin: 0 }}>
            <strong>Adaptive:</strong> always recommends your weakest domains, regardless of coverage.
          </p>
        </InfoModal>
      )}

      {showFocusAreasInfo && (
        <InfoModal title="Focus Areas" onClose={() => setShowFocusAreasInfo(false)}>
          <p style={{ margin: "0 0 14px 0" }}>
            Domains you're <strong>still getting wrong</strong> — split by module. <strong>Study</strong> (left)
            shows weak domains based only on your Study-mode results; <strong>Practice</strong> (right) shows
            weak domains based only on your Practice results.
          </p>
          <p style={{ margin: "0 0 14px 0" }}>
            Exam's weak domains aren't repeated here — they're already shown in Overall Readiness's domain
            legend above.
          </p>
          <p style={{ margin: 0 }}>
            This is different from Current Study Plan, which only tracks what you haven't finished studying
            yet. A domain can drop off Current Study Plan once it's covered, but still show up here if you
            keep getting it wrong afterward.
          </p>
        </InfoModal>
      )}

      {weakAreaPrompt && (
        <InfoModal
          title="Why this section?"
          onClose={() => setWeakAreaPrompt(null)}
          actionLabel="Start Studying"
          onAction={() => {
            navigate(`/session/study/${encodeURIComponent(weakAreaPrompt.categoryName)}`);
            setWeakAreaPrompt(null);
          }}
        >
          <p style={{ margin: "0 0 14px 0" }}>
            Based on your{" "}
            {weakAreaPrompt.source === "study" ? "Study" : weakAreaPrompt.source === "practice" ? "Practice" : "combined Study, Practice, and Exam"} results, you're scoring{" "}
            <strong style={{ color: weakAreaPrompt.categoryAcc >= 60 ? "var(--warning,#ff9500)" : "var(--danger,#ff3b30)" }}>
              {weakAreaPrompt.categoryAcc}%
            </strong>{" "}
            on <strong>{weakAreaPrompt.categoryName}</strong>
            {weakAreaPrompt.domainAcc !== null && (
              <> — the main reason {weakAreaPrompt.domainCode} ({weakAreaPrompt.domainName}) is sitting at{" "}
              {weakAreaPrompt.domainAcc}% in {weakAreaPrompt.source === "study" ? "Study" : weakAreaPrompt.source === "practice" ? "Practice" : "overall"}</>
            )}.
          </p>
          <p style={{ margin: 0 }}>
            Reviewing this section should help move both numbers before your next attempt.
          </p>
        </InfoModal>
      )}

      {showReadinessInfo && (
        <InfoModal title="What is Overall Readiness?" onClose={() => setShowReadinessInfo(false)}>
          <p style={{ margin: "0 0 14px 0" }}>
            The percentage of your <strong>most recently completed cycle that passed</strong> — one attempt on
            each of the 5 distinct Exam Sets, scored at 75% or higher.
          </p>
          <p style={{ margin: "0 0 14px 0" }}>
            The domain list beside the ring uses these attempts too — red under 60%, amber 60–74%, green 75%+ —
            so a domain that's only weak on Exams (not Study or Practice) still shows up clearly here, even
            though it won't appear in Focus Areas below.
          </p>
          <p style={{ margin: "0 0 14px 0" }}>
            An average can hide inconsistency: two strong attempts and three weak ones can still blend into a
            deceptively okay-looking number. Pass rate fixes that. But all-time pass rate has its own problem —
            it never lets go of your early attempts. Fail a cycle while you're still learning, then genuinely
            improve and pass the next one, and all-time rate is stuck at a low number forever. Only counting
            your most recent full cycle fixes that.
          </p>
          <p style={{ margin: "0 0 14px 0" }}>
            A cycle completes once you've attempted all 5 Exam Sets. Retaking a set before finishing the cycle
            replaces that set's score for the cycle, so cramming retakes can't inflate or corrupt the count —
            each set only counts once per cycle, whichever attempt was most recent.
          </p>
          <p style={{ margin: "0 0 14px 0" }}>
            <strong>Aim for 100%</strong> — every Exam Set passing in the same cycle. Lower than that means
            your good scores aren't reliable yet, not that you're halfway there.
          </p>
          <p style={{ margin: 0, color: "var(--muted)", fontSize: 13 }}>
            This measures consistency on <em>this app's</em> mock exams — it isn't a prediction of your real
            ISACA exam result. The real exam has its own scoring and question pool that no mock exam can fully
            replicate, so treat this as a self-check, not a guarantee.
          </p>
        </InfoModal>
      )}

      {showAssessment && (
        <AssessmentQuizModal
          onComplete={handleAssessmentComplete}
          onClose={() => setShowAssessment(false)}
        />
      )}

    </div>
  );
};

export default Dashboard;
