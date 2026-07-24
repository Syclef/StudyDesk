import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DailyQuizModal from "./DailyQuizModal";
import HelpModal from "./HelpModal";
import AssessmentQuizModal, { type AssessmentPerDomain } from "./AssessmentQuizModal";
import InfoModal from "./InfoModal";
import { useTheme } from "../../utils/theme";
import { computeExamCycles } from "../../utils/examCycles";

const API_BASE = "http://127.0.0.1:4000";

const SPACE = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };
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

const DOMAIN_COLORS: Record<string, string> = {
  D1: "#0071e3",
  D2: "#34c759",
  D3: "#ff9500",
  D4: "#af52de",
  D5: "#00b4d8",
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

interface DailyQuizResult {
  date: string;
  domain: string;
  correct: number;
  total: number;
}

const S = {
  label: {
    fontSize: 13,
    fontWeight: 700,
    color: "var(--muted)",
    textTransform: "uppercase" as const,
    letterSpacing: "0.06em",
    marginBottom: 6,
  } as React.CSSProperties,
  value: {
    fontSize: 32,
    fontWeight: 700,
    color: "var(--text)",
    letterSpacing: "-0.5px",
    lineHeight: 1.1,
  } as React.CSSProperties,
  sub: {
    fontSize: 13,
    color: "var(--muted)",
    marginTop: 4,
  } as React.CSSProperties,
  card: {
    background: "var(--card-bg)",
    border: "1px solid var(--card-border)",
    borderRadius: 16,
    padding: "18px 20px",
    display: "flex",
    flexDirection: "column" as const,
    boxShadow: "var(--shadow-sm)",
    minHeight: 0,
    minWidth: 0,
    overflow: "hidden",
  } as React.CSSProperties,
  emptyState: {
    textAlign: "center" as const,
    padding: "16px 0",
    color: "var(--muted)",
    fontSize: 13,
  } as React.CSSProperties,
  dot: (color: string): React.CSSProperties => ({
    display: "inline-block",
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: color,
    marginRight: 8,
    flexShrink: 0,
  }),
};

const ProgressRing: React.FC<{ pct: number | null; size?: number; label?: string }> = ({ pct, size = 130, label = "Readiness" }) => {
  const stroke = 10;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - (pct ?? 0) / 100);
  return (
    <div style={{ width: size, height: size, flexShrink: 0, position: "relative" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
        {pct !== null && (
          <circle
            cx={size / 2} cy={size / 2} r={r} fill="none"
            stroke="var(--accent)" strokeWidth={stroke} strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={offset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ transition: "stroke-dashoffset 0.4s ease" }}
          />
        )}
        <text x="50%" y="46%" textAnchor="middle" dominantBaseline="middle" fontSize={size * 0.22} fontWeight={700} fill="var(--text)">
          {pct !== null ? `${pct}%` : "—"}
        </text>
        <text x="50%" y="65%" textAnchor="middle" dominantBaseline="middle" fontSize={size * 0.1} fill="var(--muted)">
          {label}
        </text>
      </svg>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const [attempts, setAttempts] = useState<AttemptSummary[]>([]);
  const [, setDomainProgress] = useState<DomainProgress[]>([]);
  const [examDomainProgress, setExamDomainProgress] = useState<DomainProgress[]>([]);
  const [studyDomainProgress, setStudyDomainProgress] = useState<DomainProgress[]>([]);
  const [practiceDomainProgress, setPracticeDomainProgress] = useState<DomainProgress[]>([]);
  const [categoriesByDomain, setCategoriesByDomain] = useState<CategorySummary[]>([]);
  const [, setCategoryProgress] = useState<CategoryProgress[]>([]);
  const [studyCategoryProgress, setStudyCategoryProgress] = useState<CategoryProgress[]>([]);
  const [practiceCategoryProgress, setPracticeCategoryProgress] = useState<CategoryProgress[]>([]);
  const [latestPractice, setLatestPractice] = useState<{
    mockSlot: number | null;
    submittedAt: string | null;
    domains: { domain: string; attempted: number; correct: number; acc: number | null }[];
  } | null>(null);
  const [practiceBreakdown, setPracticeBreakdown] = useState<{
    domainCode: string;
    domainName: string;
    needsImprovement: { category: string; acc: number }[];
    gettingThere: { category: string; acc: number }[];
  } | null>(null);
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
  const [, setLoading] = useState(true);
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

    fetch(`${API_BASE}/progress/domains?mode=EXAM`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data: DomainProgress[]) => setExamDomainProgress(Array.isArray(data) ? data : []))
      .catch(() => setExamDomainProgress([]));

    fetch(`${API_BASE}/progress/domains?mode=STUDY`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data: DomainProgress[]) => setStudyDomainProgress(Array.isArray(data) ? data : []))
      .catch(() => setStudyDomainProgress([]));

    fetch(`${API_BASE}/progress/domains?mode=PRACTICE`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data: DomainProgress[]) => setPracticeDomainProgress(Array.isArray(data) ? data : []))
      .catch(() => setPracticeDomainProgress([]));

    fetch(`${API_BASE}/categories`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data: CategorySummary[]) => setCategoriesByDomain(Array.isArray(data) ? data : []))
      .catch(() => setCategoriesByDomain([]));

    fetch(`${API_BASE}/progress/categories`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data: CategoryProgress[]) => setCategoryProgress(Array.isArray(data) ? data : []))
      .catch(() => setCategoryProgress([]));

    fetch(`${API_BASE}/progress/categories?mode=STUDY`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data: CategoryProgress[]) => setStudyCategoryProgress(Array.isArray(data) ? data : []))
      .catch(() => setStudyCategoryProgress([]));

    fetch(`${API_BASE}/progress/categories?mode=PRACTICE`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data: CategoryProgress[]) => setPracticeCategoryProgress(Array.isArray(data) ? data : []))
      .catch(() => setPracticeCategoryProgress([]));

    fetch(`${API_BASE}/progress/latest-practice`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data) => setLatestPractice(data ?? null))
      .catch(() => setLatestPractice(null));

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
    const recommendedMode: "hybrid" | "adaptive" = spread > 25 ? "adaptive" : "hybrid";

    const result = { perDomain, recommendedMode };
    localStorage.setItem(ASSESSMENT_KEY, JSON.stringify(result));
    setAssessmentResult(result);
    setStudyPlanMode(recommendedMode);
    localStorage.setItem(STUDY_PLAN_MODE_KEY, recommendedMode);
    setShowAssessment(false);
  };

  const goToStudyDomain = (code: string) => {
    sessionStorage.setItem("study_open_domains", JSON.stringify([code]));
    sessionStorage.setItem("study_scroll_target", code);
    navigate("/study");
  };

  const showPracticeBreakdown = (domainCode: string) => {
    const domainCategories = categoriesByDomain.find(c => c.domain === domainCode)?.categories ?? [];
    const needsImprovement: { category: string; acc: number }[] = [];
    const gettingThere: { category: string; acc: number }[] = [];
    domainCategories.forEach(cat => {
      const p = practiceCategoryProgress.find(c => c.category === cat.name);
      if (!p || p.attempted === 0) return;
      const acc = Math.round((p.correct / p.attempted) * 100);
      if (acc >= WEAK_THRESHOLD) return;
      if (acc <= 50) needsImprovement.push({ category: cat.name, acc });
      else gettingThere.push({ category: cat.name, acc });
    });
    needsImprovement.sort((a, b) => a.acc - b.acc);
    gettingThere.sort((a, b) => a.acc - b.acc);
    setPracticeBreakdown({
      domainCode,
      domainName: DOMAIN_NAMES[domainCode] ?? domainCode,
      needsImprovement,
      gettingThere,
    });
  };

  const goToStudyCategory = (categoryName: string) => {
    navigate(`/session/study/${encodeURIComponent(categoryName)}`);
  };

  const saveDate = () => {
    if (!tempDate) return;
    localStorage.setItem(EXAM_DATE_KEY, tempDate);
    setExamDate(tempDate);
    setEditingDate(false);
  };

  const now = new Date();
  const exam = new Date(examDate);
  const daysLeft = Math.max(Math.ceil((exam.getTime() - now.getTime()) / 86400000), 0);
  const submitted = attempts.filter(a => a.submittedAt);
  
  const examOnlyForReadiness = submitted
    .filter(a => a.mode === "EXAM" && a.percent !== null)
    .map(a => ({ id: a.id, mockSlot: a.mockSlot, percent: a.percent, submittedAt: a.submittedAt }));
  const { completedCycles } = computeExamCycles(examOnlyForReadiness);
  const examAttemptsForReadiness = completedCycles.length > 0 ? completedCycles[completedCycles.length - 1] : null;
  const examPassedCount = examAttemptsForReadiness?.passedCount ?? 0;
  const overallAccuracy = examAttemptsForReadiness ? Math.round((examPassedCount / 5) * 100) : 0;

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const examDomainRows = useMemo(() => {
    return Object.entries(DOMAIN_NAMES).map(([code, name]) => {
      const d = examDomainProgress.find(dp => dp.domain === code);
      const attempted = d?.attempted ?? 0;
      const correct = d?.correct ?? 0;
      const acc = attempted > 0 ? Math.round((correct / attempted) * 100) : null;
      return { code, name, acc };
    });
  }, [examDomainProgress]);

  const WEAK_THRESHOLD = 75;

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

  const studyFocusAreas = useMemo(() => {
    const rows: { domain: string; domainName: string; category: string; acc: number | null }[] = [];
    categoriesByDomain.forEach(cd => {
      cd.categories.forEach(cat => {
        const p = studyCategoryProgress.find(c => c.category === cat.name);
        const acc = p && p.attempted > 0 ? Math.round((p.correct / p.attempted) * 100) : null;
        rows.push({ domain: cd.domain, domainName: DOMAIN_NAMES[cd.domain] ?? cd.domain, category: cat.name, acc });
      });
    });
    return rows
      .filter(r => r.acc !== null && r.acc < WEAK_THRESHOLD)
      .sort((a, b) => (a.acc ?? 0) - (b.acc ?? 0));
  }, [categoriesByDomain, studyCategoryProgress]);

  const practiceFocusAreas = useMemo(() => {
    return practiceDomainRows
      .filter(d => d.acc !== null && d.acc < WEAK_THRESHOLD)
      .sort((a, b) => (a.acc ?? 0) - (b.acc ?? 0));
  }, [practiceDomainRows]);

  const studyStrengths = useMemo(() => {
    const rows: { domain: string; domainName: string; category: string; acc: number }[] = [];
    categoriesByDomain.forEach(cd => {
      cd.categories.forEach(cat => {
        const p = studyCategoryProgress.find(c => c.category === cat.name);
        if (!p || p.attempted === 0) return;
        const acc = Math.round((p.correct / p.attempted) * 100);
        if (acc >= WEAK_THRESHOLD) rows.push({ domain: cd.domain, domainName: DOMAIN_NAMES[cd.domain] ?? cd.domain, category: cat.name, acc });
      });
    });
    return rows.sort((a, b) => b.acc - a.acc);
  }, [categoriesByDomain, studyCategoryProgress]);

  const practiceStrengths = useMemo(() => {
    if (!latestPractice) return [];
    return latestPractice.domains
      .filter(d => d.acc !== null && d.acc >= WEAK_THRESHOLD)
      .map(d => ({ code: d.domain, name: DOMAIN_NAMES[d.domain] ?? d.domain, acc: d.acc as number }))
      .sort((a, b) => b.acc - a.acc);
  }, [latestPractice]);

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

    const notStarted = notCompleted.filter(d => d.status === "Not Started");
    if (notStarted.length > 0) return notStarted.slice(0, 2);
    const started = notCompleted.filter(d => d.acc !== null).sort((a, b) => (a.acc ?? 0) - (b.acc ?? 0));
    return started.slice(0, 2);
  }, [studyDomainRows, studyPlanMode]);

  return (
    <div style={{ 
      width: "100%", 
      height: "100dvh", 
      overflow: "hidden", 
      background: "var(--bg)", 
      color: "var(--text)", 
      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
      boxSizing: "border-box",
      padding: `${SPACE.md}px 32px ${SPACE.lg}px`,
      display: "flex",
      flexDirection: "column",
      gap: SPACE.md
    }}>

      {/* ── Branding Header ── */}
      <div style={{ textAlign: "center" as const, flexShrink: 0 }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.4px" }}>
          CISA Prep<span style={{ color: "var(--accent)" }}>.</span>
        </div>
      </div>

      {/* ── User & Exam Status Bar ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, letterSpacing: "-0.3px", color: "var(--text)" }}>
            Good {now.getHours() < 12 ? "morning" : now.getHours() < 17 ? "afternoon" : "evening"}{displayName ? `, ${displayName}` : ""} 👋
          </h1>
          <p style={{ fontSize: 14, color: "var(--muted)", margin: "4px 0 0 0" }}>
            CISA Exam: <strong style={{ color: daysLeft <= 14 && daysLeft > 0 ? "var(--danger)" : "var(--text)", fontWeight: 700 }}>{daysLeft} days left</strong>
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: SPACE.md }}>
          {editingDate ? (
            <>
              <input type="date" value={tempDate} onChange={e => setTempDate(e.target.value)}
                style={{ fontSize: 14, padding: "6px 10px", borderRadius: 8, border: "1px solid var(--input-border)", background: "var(--input-bg)", color: "var(--text)" }} />
              <button onClick={saveDate} style={{ background: "var(--accent)", color: "#fff", border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Save</button>
              <button onClick={() => { setTempDate(examDate); setEditingDate(false); }} style={{ background: "none", color: "var(--muted)", border: "1px solid var(--border)", borderRadius: 8, padding: "6px 10px", fontSize: 14, cursor: "pointer" }}>Cancel</button>
            </>
          ) : (
            <>
              <span style={{ fontSize: 14, color: "var(--muted)" }}>
                Exam date: <strong style={{ color: "var(--text)", fontWeight: 600 }}>{formatDate(examDate)}</strong>
              </span>
              <button onClick={() => { setTempDate(examDate); setEditingDate(true); }}
                style={{ background: "none", border: "1px solid var(--border)", borderRadius: 8, padding: "4px 10px", fontSize: 13, color: "var(--muted)", cursor: "pointer" }}>
                Edit
              </button>
            </>
          )}
          <button onClick={() => setShowHelp(true)} title="How this works"
            style={{
              width: 30, height: 30, borderRadius: "50%",
              border: "1px solid var(--border)", background: "none", color: "var(--muted)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 700, cursor: "pointer", flexShrink: 0,
            }}>
            ?
          </button>
          <div style={{ position: "relative" }}>
            <button onClick={() => setShowSettings(v => !v)} title="Settings"
              style={{
                width: 30, height: 30, borderRadius: "50%",
                border: "1px solid var(--border)", background: "none", color: "var(--muted)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
              }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </button>
            {showSettings && (
              <div style={{
                position: "absolute", top: 36, right: 0, zIndex: 30, width: 200,
                background: "var(--card-bg)", border: "1px solid var(--card-border)",
                borderRadius: 12, boxShadow: "var(--shadow)", padding: 14,
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, color: "var(--text)", fontWeight: 500 }}>
                    {mode === "dark" ? "Dark mode" : "Light mode"}
                  </span>
                  <button onClick={toggleTheme}
                    style={{
                      width: 28, height: 28, borderRadius: 6,
                      border: "1px solid var(--border)", background: "transparent", color: "var(--muted)",
                      display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                    }}>
                    {mode === "dark" ? (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
                    ) : (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mode Quick Navigation ── */}
      <div style={{ display: "flex", justifyContent: "center", gap: SPACE.md, flexShrink: 0 }}>
        <button onClick={() => navigate("/practice")} style={{
          padding: "10px 20px", borderRadius: 10, border: "1px solid var(--card-border)",
          background: "var(--card-bg)", color: "var(--text)", fontWeight: 600, fontSize: 14,
          cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: "var(--shadow-sm)"
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>
          Practice
        </button>
        <button onClick={() => navigate("/exam")} style={{
          padding: "10px 20px", borderRadius: 10, border: "1px solid var(--card-border)",
          background: "var(--card-bg)", color: "var(--text)", fontWeight: 600, fontSize: 14,
          cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: "var(--shadow-sm)"
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z" /><path d="M6 12v5c0 1.5 2.5 3 6 3s6-1.5 6-3v-5" /></svg>
          Exam
        </button>
        <button onClick={() => navigate("/flashcards")} style={{
          padding: "10px 20px", borderRadius: 10, border: "1px solid var(--card-border)",
          background: "var(--card-bg)", color: "var(--text)", fontWeight: 600, fontSize: 14,
          cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: "var(--shadow-sm)"
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18" /></svg>
          Flashcards
        </button>
      </div>

      {/* ── Responsive Viewport Container (Flex 1, Zero Main Page Scroll) ── */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, gap: SPACE.md }}>
        
        {/* ── Top Row: 3 Primary Cards ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: SPACE.md, flex: "1 1 0px", minHeight: 0 }}>
          
          {/* Current Study Plan */}
          <div style={S.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: SPACE.xs, flexShrink: 0 }}>
              <span style={S.label}>CURRENT STUDY PLAN</span>
              <button onClick={() => setShowStudyPlanInfo(true)} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 13 }}>ⓘ</button>
            </div>
            <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              {!assessmentResult && studyPlan.every(d => d.status === "Not Started") ? (
                <div style={{ background: "var(--accent-bg, rgba(0,113,227,0.08))", borderRadius: 12, padding: 16, textAlign: "center", border: "1px solid var(--accent-border, rgba(0,113,227,0.2))", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--accent)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>✓</div>
                  <p style={{ fontSize: 13, color: "var(--text)", margin: 0, lineHeight: 1.4 }}>
                    Take a quick 25-question assessment so we can build a study plan around how you're currently doing.
                  </p>
                  <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                    <button onClick={() => setShowAssessment(true)} style={{ background: "var(--accent)", color: "#fff", border: "none", borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                      Take Assessment
                    </button>
                    <button onClick={() => navigate("/study")} style={{ background: "var(--card-bg)", color: "var(--text)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                      I'll Do It Myself
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10, overflowY: "auto", minHeight: 0 }}>
                  {studyPlan.map((d) => (
                    <div key={d.code} onClick={() => goToStudyDomain(d.code)} style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid var(--border)", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--input-bg)" }}>
                      <div style={{ display: "flex", alignItems: "center", minWidth: 0, flex: 1 }}>
                        <span style={S.dot(DOMAIN_COLORS[d.code] || "#999")} />
                        <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.code}: {d.name}</span>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: d.status === "Completed" ? "var(--success, #34c759)" : "var(--muted)", marginLeft: 12, flexShrink: 0 }}>{d.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Overall Readiness */}
          <div style={S.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: SPACE.xs, flexShrink: 0 }}>
              <span style={S.label}>OVERALL READINESS</span>
              <button onClick={() => setShowReadinessInfo(true)} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 13 }}>ⓘ</button>
            </div>
            <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", justifyContent: "center", gap: 6 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", gap: 16 }}>
                <ProgressRing pct={examAttemptsForReadiness ? overallAccuracy : null} size={125} label="Ready" />
                <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1, minWidth: 0 }}>
                  {examDomainRows.map(d => (
                    <div key={d.code} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
                      <div style={{ display: "flex", alignItems: "center", minWidth: 0 }}>
                        <span style={S.dot(DOMAIN_COLORS[d.code] || "#999")} />
                        <span style={{ color: "var(--muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Domain {d.code.slice(1)}</span>
                      </div>
                      <span style={{
                        fontWeight: 600, marginLeft: 8, display: "flex", alignItems: "center", gap: 4,
                        color: d.acc === null ? "var(--muted)"
                          : d.acc < 60 ? "var(--danger,#ff3b30)"
                          : d.acc < 75 ? "var(--warning,#ff9500)"
                          : "var(--success,#34c759)",
                      }}>
                        {d.acc !== null && d.acc >= 75 && "✓ "}{d.acc !== null ? `${d.acc}%` : "—"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              {examDomainRows.some(d => d.acc !== null) && (
                <div style={{ fontSize: 13, color: "var(--success,#34c759)", fontWeight: 600, textAlign: "center" as const }}>
                  {examDomainRows.filter(d => d.acc !== null && d.acc >= 75).length}/5 domains passing
                </div>
              )}
            </div>
          </div>

          {/* Daily Quiz */}
          <div style={S.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: SPACE.xs, flexShrink: 0 }}>
              <span style={S.label}>DAILY QUIZ</span>
            </div>
            <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", justifyContent: "center", gap: 14 }}>
              <div>
                <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 4 }}>Today's topic:</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", lineHeight: 1.3 }}>
                  {todayDomainName} — 10 Questions
                </div>
              </div>
              {dailyQuizResult ? (
                <div style={{ background: "var(--input-bg)", padding: 12, borderRadius: 10, textAlign: "center", border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: 13, color: "var(--muted)" }}>Completed today</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", marginTop: 2 }}>{dailyQuizResult.correct} / {dailyQuizResult.total} Correct</div>
                </div>
              ) : (
                <button onClick={() => setShowDailyQuiz(true)} style={{ background: "var(--accent)", color: "#fff", border: "none", borderRadius: 10, padding: "12px", fontSize: 14, fontWeight: 600, cursor: "pointer", width: "100%", boxShadow: "0 2px 8px rgba(0,113,227,0.25)" }}>
                  Take Today's Challenge
                </button>
              )}
            </div>
          </div>

        </div>

        {/* ── Bottom Row: Focus Areas & Strengths ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: SPACE.md, flex: "1.15 1 0px", minHeight: 0 }}>
          
          {/* Focus Areas Card */}
          <div style={S.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2, flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ ...S.label, marginBottom: 0 }}>FOCUS AREAS</span>
                <button onClick={() => setShowFocusAreasInfo(true)} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 13 }}>ⓘ</button>
              </div>
            </div>
            <p style={{ fontSize: 13, color: "var(--muted)", margin: "0 0 10px 0", flexShrink: 0 }}>
              Once studied, take an Exam Set to see it reflected in Overall Readiness above.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: SPACE.lg, flex: 1, minHeight: 0 }}>
              
              {/* Study Focus */}
              <div style={{ display: "flex", flexDirection: "column", minHeight: 0, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", letterSpacing: "0.05em", marginBottom: 8, paddingBottom: 6, borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
                  STUDY
                </div>
                <div style={{ flex: 1, minHeight: 0, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, paddingRight: 4 }}>
                  {studyFocusAreas.length === 0 ? (
                    <div style={S.emptyState}>No weak areas identified yet in Study!</div>
                  ) : (
                    studyFocusAreas.map(r => (
                      <div key={`study-${r.domain}-${r.category}`} onClick={() => goToStudyCategory(r.category)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", borderRadius: 8, background: "var(--input-bg)", border: "1px solid var(--border)", cursor: "pointer", fontSize: 13 }}>
                        <span style={{ fontWeight: 500, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", flex: 1, minWidth: 0 }}>
                          {r.category}
                        </span>
                        <span style={{ fontWeight: 600, color: r.acc === null ? "var(--danger, #ff3b30)" : r.acc < 60 ? "var(--danger, #ff3b30)" : "var(--warning, #ff9500)", marginLeft: 10, flexShrink: 0 }}>
                          {r.acc === null ? "Not attempted" : `${r.acc}%`}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Practice Focus */}
              <div style={{ display: "flex", flexDirection: "column", minHeight: 0, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", letterSpacing: "0.05em", marginBottom: 8, paddingBottom: 6, borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
                  PRACTICE
                </div>
                <div style={{ flex: 1, minHeight: 0, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, paddingRight: 4 }}>
                  {practiceFocusAreas.length === 0 ? (
                    <div style={S.emptyState}>No weak areas identified yet in Practice!</div>
                  ) : (
                    practiceFocusAreas.map(d => (
                      <div key={`practice-${d.code}`} onClick={() => showPracticeBreakdown(d.code)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", borderRadius: 8, background: "var(--input-bg)", border: "1px solid var(--border)", cursor: "pointer", fontSize: 13 }}>
                        <div style={{ display: "flex", alignItems: "center", minWidth: 0, flex: 1 }}>
                          <span style={S.dot(DOMAIN_COLORS[d.code] || "#999")} />
                          <span style={{ fontWeight: 500, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.code} {d.name}</span>
                        </div>
                        <span style={{ fontWeight: 600, color: d.acc === null ? "var(--danger, #ff3b30)" : d.acc < 60 ? "var(--danger, #ff3b30)" : "var(--warning, #ff9500)", marginLeft: 10, flexShrink: 0 }}>
                          {d.acc === null ? "Not attempted" : `${d.acc}%`}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* Strengths Card */}
          <div style={S.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2, flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ ...S.label, marginBottom: 0 }}>STRENGTHS</span>
              </div>
            </div>
            <p style={{ fontSize: 13, color: "var(--muted)", margin: "0 0 10px 0", flexShrink: 0 }}>
              What you're already doing well — 75% or better.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: SPACE.lg, flex: 1, minHeight: 0 }}>

              {/* Study Strengths */}
              <div style={{ display: "flex", flexDirection: "column", minHeight: 0, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", letterSpacing: "0.05em", marginBottom: 8, paddingBottom: 6, borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
                  STUDY
                </div>
                <div style={{ flex: 1, minHeight: 0, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, paddingRight: 4 }}>
                  {studyStrengths.length === 0 ? (
                    <div style={S.emptyState}>No strong categories yet in Study.</div>
                  ) : (
                    studyStrengths.map(r => (
                      <div key={`strength-study-${r.domain}-${r.category}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", borderRadius: 8, background: "var(--input-bg)", border: "1px solid var(--border)", fontSize: 13 }}>
                        <span style={{ fontWeight: 500, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", flex: 1, minWidth: 0 }}>
                          {r.category}
                        </span>
                        <span style={{ fontWeight: 600, color: "var(--success,#34c759)", marginLeft: 10, flexShrink: 0 }}>
                          ✓ {r.acc}%
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Practice Strengths */}
              <div style={{ display: "flex", flexDirection: "column", minHeight: 0, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", letterSpacing: "0.05em", marginBottom: 2, paddingBottom: 6, borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
                  PRACTICE
                </div>
                <div style={{ fontSize: 12, color: "var(--muted)", margin: "4px 0 8px 0", flexShrink: 0 }}>
                  {latestPractice?.mockSlot
                    ? `Based on your last attempt — Practice Set ${latestPractice.mockSlot}`
                    : "Complete a Practice Set to see this"}
                </div>
                <div style={{ flex: 1, minHeight: 0, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, paddingRight: 4 }}>
                  {practiceStrengths.length === 0 ? (
                    <div style={S.emptyState}>
                      {latestPractice ? "Nothing at 75%+ in your last Practice Set." : "No Practice Set completed yet."}
                    </div>
                  ) : (
                    practiceStrengths.map(d => (
                      <div key={`strength-practice-${d.code}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", borderRadius: 8, background: "var(--input-bg)", border: "1px solid var(--border)", fontSize: 13 }}>
                        <div style={{ display: "flex", alignItems: "center", minWidth: 0, flex: 1 }}>
                          <span style={S.dot(DOMAIN_COLORS[d.code] || "#999")} />
                          <span style={{ fontWeight: 500, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.code} {d.name}</span>
                        </div>
                        <span style={{ fontWeight: 600, color: "var(--success,#34c759)", marginLeft: 10, flexShrink: 0 }}>
                          ✓ {d.acc}%
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* ── Modals ── */}
      {showDailyQuiz && (
        <DailyQuizModal
          domain={todayDomain}
          domainName={todayDomainName}
          onClose={() => setShowDailyQuiz(false)}
          onComplete={handleDailyQuizComplete}
        />
      )}
      {showAssessment && (
        <AssessmentQuizModal
          onClose={() => setShowAssessment(false)}
          onComplete={handleAssessmentComplete}
        />
      )}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}

      {showStudyPlanInfo && (
        <InfoModal title="Current Study Plan" onClose={() => setShowStudyPlanInfo(false)}>
          <p style={{ margin: "0 0 14px 0" }}>
            Domains you <strong>haven't finished covering yet in Study</strong> — based only on Study-module
            coverage, not how well you're scoring elsewhere. Once a domain is fully covered, it drops off this
            list for good.
          </p>
          <p style={{ margin: "0 0 14px 0" }}>
            <strong>Hybrid:</strong> unstudied domains first, then your weakest once everything's been touched.
          </p>
          <p style={{ margin: 0 }}>
            <strong>Adaptive:</strong> always recommends your weakest domains, regardless of coverage.
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
            so a domain that's only weak on Exams still shows up clearly here.
          </p>
          <p style={{ margin: "0 0 14px 0" }}>
            A cycle completes once you've attempted all 5 Exam Sets. Retaking a set before finishing the cycle
            replaces that set's score for the cycle, so cramming retakes can't inflate or corrupt the count.
          </p>
          <p style={{ margin: "0 0 14px 0" }}>
            <strong>Aim for 100%</strong> — every Exam Set passing in the same cycle. Lower than that means
            your good scores aren't reliable yet.
          </p>
          <p style={{ margin: 0, color: "var(--muted)", fontSize: 13 }}>
            This measures consistency on <em>this app's</em> mock exams — it isn't a prediction of your real
            ISACA exam result.
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
          <p style={{ margin: 0 }}>
            This is different from Current Study Plan, which only tracks what you haven't finished studying
            yet.
          </p>
        </InfoModal>
      )}

      {practiceBreakdown && (
        <InfoModal
          title={`${practiceBreakdown.domainCode}: ${practiceBreakdown.domainName}`}
          onClose={() => setPracticeBreakdown(null)}
        >
          <p style={{ margin: "0 0 16px 0", fontSize: 13, color: "var(--muted)" }}>
            Every category you've attempted in Practice for this domain, split by how close you are to
            the 75% passing mark. Click any category to study it.
          </p>
          {(() => {
            const hasNeeds = practiceBreakdown.needsImprovement.length > 0;
            const hasGetting = practiceBreakdown.gettingThere.length > 0;
            if (!hasNeeds && !hasGetting) {
              return <p style={{ margin: 0, fontSize: 13, color: "var(--muted)" }}>Nothing to show yet for this domain in Practice.</p>;
            }
            return (
              <div style={{ display: "grid", gridTemplateColumns: hasNeeds && hasGetting ? "1fr 1fr" : "1fr", gap: 24 }}>
                {hasNeeds && (
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--danger,#ff3b30)", textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: 8, paddingBottom: 6, borderBottom: "1px solid var(--border)" }}>
                      Needs Improvement (≤50%)
                    </div>
                    {practiceBreakdown.needsImprovement.map(c => (
                      <div key={c.category}
                        onClick={() => { goToStudyCategory(c.category); setPracticeBreakdown(null); }}
                        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--border)", cursor: "pointer", fontSize: 13 }}>
                        <span style={{ color: "var(--text)" }}>{c.category}</span>
                        <span style={{ fontWeight: 600, color: "var(--danger,#ff3b30)", marginLeft: 12, flexShrink: 0 }}>{c.acc}%</span>
                      </div>
                    ))}
                  </div>
                )}
                {hasGetting && (
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--warning,#ff9500)", textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: 8, paddingBottom: 6, borderBottom: "1px solid var(--border)" }}>
                      Getting There (51–74%)
                    </div>
                    {practiceBreakdown.gettingThere.map(c => (
                      <div key={c.category}
                        onClick={() => { goToStudyCategory(c.category); setPracticeBreakdown(null); }}
                        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--border)", cursor: "pointer", fontSize: 13 }}>
                        <span style={{ color: "var(--text)" }}>{c.category}</span>
                        <span style={{ fontWeight: 600, color: "var(--warning,#ff9500)", marginLeft: 12, flexShrink: 0 }}>{c.acc}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
        </InfoModal>
      )}

    </div>
  );
};

export default Dashboard;