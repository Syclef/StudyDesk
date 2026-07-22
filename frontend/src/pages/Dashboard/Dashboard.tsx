import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DailyQuizModal from "./DailyQuizModal";
import HelpModal from "./HelpModal";
import AssessmentQuizModal, { type AssessmentPerDomain } from "./AssessmentQuizModal";
import { useTheme } from "../../utils/theme";

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
const ProgressRing: React.FC<{ pct: number; size?: number }> = ({ pct, size = 140 }) => {
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
        Readiness
      </text>
    </svg>
  );
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState<AttemptSummary[]>([]);
  const [domainProgress, setDomainProgress] = useState<DomainProgress[]>([]);
  const [studyDomainProgress, setStudyDomainProgress] = useState<DomainProgress[]>([]);
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

    // Study-only view — Current Study Plan should only reflect Study-module
    // activity, not Practice/Exam sessions that happened to touch the same
    // questions (those still count toward the combined Overall Progress above).
    fetch(`${API_BASE}/progress/domains?mode=STUDY`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data: DomainProgress[]) => setStudyDomainProgress(Array.isArray(data) ? data : []))
      .catch(() => setStudyDomainProgress([]));

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
  // Unique questions covered (not cumulative repeats) — summing per-domain
  // coverage is safe since domains partition the question set.
  const totalAttempted = domainProgress.reduce((s, d) => s + d.attempted, 0);
  // Overall Accuracy (readiness) — this is what the ring shows, not coverage.
  // Coverage alone doesn't answer "am I ready," so it's demoted to a small
  // caption under the ring instead of being the headline number.
  const totalCorrectCombined = domainProgress.reduce((s, d) => s + d.correct, 0);
  const overallAccuracy = totalAttempted > 0 ? Math.round((totalCorrectCombined / totalAttempted) * 100) : 0;

  // Recent Activity — real sessions across all three modules, already
  // sorted desc by submittedAt from the server.
  const recentActivity = submitted.slice(0, 1).map(a => {
    const label = a.mode === "STUDY" ? `${a.domain ? `Domain ${a.domain.replace("D", "")}` : "Study"} Quiz`
      : a.mode === "PRACTICE" ? `Practice Set ${a.mockSlot ?? ""}`.trim()
      : `Mock Exam${a.mockSlot ? ` ${a.mockSlot}` : ""}`;
    return { ...a, label };
  });

  // Flashcard activity — placeholder. FlashcardStudy.tsx only stores a
  // per-card confidence map in localStorage right now, with no timestamped
  // session log, so there's nothing real to show here yet. Once that's
  // built, populate this the same way as recentActivity above (most recent
  // session only, to match).
  const flashcardActivity: { id: string; label: string; subtitle: string }[] = [];

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  // ── Domain breakdown data (feeds Overall Progress legend, Current Study
  //    Plan status, and Focus Areas — combining Study + Practice + Exam) ──
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

  // Weakest domains with real data — highest-signal callout for what to study next.
  const focusAreas = useMemo(() => {
    return domainRows
      .filter(d => d.acc !== null)
      .sort((a, b) => (a.acc ?? 0) - (b.acc ?? 0))
      .slice(0, 2);
  }, [domainRows]);

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
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <button
                    onClick={() => setShowStudyPlanInfo(v => !v)}
                    title="What do Hybrid and Adaptive mean?"
                    style={{
                      width: 18, height: 18, borderRadius: "50%", border: "1.5px solid var(--muted)",
                      background: "none", color: "var(--muted)", fontSize: 11, fontWeight: 700,
                      display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: 0,
                      lineHeight: 1, fontStyle: "italic" as const, fontFamily: "Georgia, serif",
                    }}>
                    i
                  </button>
                  {showStudyPlanInfo && (
                    <div style={{
                      position: "absolute", top: 22, right: 0, zIndex: 20, width: 240,
                      background: "var(--card-bg)", border: "1px solid var(--card-border)",
                      borderRadius: 10, boxShadow: "var(--shadow)", padding: "10px 12px",
                      fontSize: 11, color: "var(--muted)", lineHeight: 1.5,
                    }}>
                      <strong style={{ color: "var(--text)" }}>Hybrid:</strong> unstudied domains first, then your weakest once everything's been touched.
                      <br /><br />
                      <strong style={{ color: "var(--text)" }}>Adaptive:</strong> always recommends your weakest domains, regardless of coverage.
                    </div>
                  )}
                </div>

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
                    onClick={() => navigate("/study")}
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
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 28, minHeight: 0 }}>
            <ProgressRing pct={loading ? 0 : overallAccuracy} size={185} />
            <div style={{ flex: 1, minWidth: 0, height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ ...S.label, fontSize: 12 }}>Overall Readiness</div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-around", marginTop: 10, maxHeight: 185 }}>
                {domainRows.map((d) => (
                  <div key={d.code} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 14 }}>
                    <span style={{ display: "flex", alignItems: "center", color: "var(--muted)" }}>
                      <span style={S.dot(DOMAIN_COLORS[d.code])} />
                      Domain {d.code.replace("D", "")}
                    </span>
                    <span style={{ color: "var(--text)", fontWeight: 600 }}>{d.acc !== null ? `${d.acc}%` : "—"}</span>
                  </div>
                ))}
              </div>
            </div>
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

      {/* ── Row 2: Focus Areas — full-width, matching reference image ── */}
      <div style={{ ...S.card, flex: 1.4 }}>
        <div style={S.label}>Focus Areas</div>
        <div style={{ fontSize: 13, color: "var(--muted)", margin: "2px 0 16px 0" }}>These are your weakest domains requiring improvement.</div>
        <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
          {focusAreas.length > 0 ? (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-around", gap: 18 }}>
              {focusAreas.map(d => (
                <div key={d.code}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, marginBottom: 8 }}>
                    <span style={{ color: "var(--text)" }}>
                      <span style={{ color: "var(--muted)", fontWeight: 600, marginRight: 8 }}>{d.code}</span>
                      {d.name}
                    </span>
                    <span style={{ fontWeight: 600, color: (d.acc ?? 0) >= 60 ? "var(--warning,#ff9500)" : "var(--danger,#ff3b30)" }}>{d.acc}%</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 999, background: "var(--border)", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${d.acc}%`, background: (d.acc ?? 0) >= 60 ? "var(--warning,#ff9500)" : "var(--danger,#ff3b30)", borderRadius: 999 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              gap: 12, borderRadius: 14, background: "var(--panel-2, var(--card-bg))", border: "1px solid var(--card-border)",
            }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
              <div style={{ ...S.emptyState, fontSize: 15, padding: 0 }}>Answer a few questions to see your weakest domains here.</div>
            </div>
          )}
        </div>
      </div>

      {/* ── Recent Activity — split: main app (Study/Practice/Exam) vs Flashcards ── */}
      <div style={{ ...S.card, flex: 1.4 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 16 }}>Recent Activity</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, flex: 1, minHeight: 0 }}>

          {/* Left: Study, Practice, Exam */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: 12 }}>
              Study · Practice · Exam
            </div>
            <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
              {recentActivity.length > 0 ? (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
                  {recentActivity.map((a) => (
                    <div key={a.id} style={{
                      flex: 1, display: "flex", alignItems: "center", gap: 16,
                      padding: "20px 22px", borderRadius: 14,
                      background: "var(--panel-2, var(--card-bg))", border: "1px solid var(--card-border)",
                    }}>
                      <div style={{
                        width: 50, height: 50, borderRadius: 12, flexShrink: 0,
                        background: "var(--accent-light, rgba(0,113,227,0.10))", color: "var(--accent)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="4" y="3" width="16" height="18" rx="2" />
                          <path d="M8 3v3h8V3M9 12l2 2 4-4" />
                        </svg>
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text)" }}>{a.label}</div>
                        <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 3 }}>
                          {a.score !== null && a.total !== null ? `Score: ${a.score}/${a.total}` : new Date(a.submittedAt!).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  flex: 1, display: "flex", alignItems: "center", gap: 16,
                  padding: "20px 22px", borderRadius: 14,
                  background: "var(--panel-2, var(--card-bg))", border: "1px solid var(--card-border)",
                }}>
                  <div style={{
                    width: 50, height: 50, borderRadius: 12, flexShrink: 0,
                    background: "var(--accent-light, rgba(0,113,227,0.10))", color: "var(--accent)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="4" y="3" width="16" height="18" rx="2" />
                      <path d="M8 3v3h8V3" />
                    </svg>
                  </div>
                  <div style={{ ...S.emptyState, fontSize: 13, padding: 0, textAlign: "left" as const }}>Your recent Study, Practice, and Exam sessions will show up here.</div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Flashcards */}
          <div style={{ borderLeft: "1px solid var(--border)", paddingLeft: 28, display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: 12 }}>
              Flashcards
            </div>
            <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
              {flashcardActivity.length > 0 ? (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
                  {flashcardActivity.map((f) => (
                    <div key={f.id} style={{
                      flex: 1, display: "flex", alignItems: "center", gap: 16,
                      padding: "20px 22px", borderRadius: 14,
                      background: "var(--panel-2, var(--card-bg))", border: "1px solid var(--card-border)",
                    }}>
                      <div style={{
                        width: 50, height: 50, borderRadius: 12, flexShrink: 0,
                        background: "var(--accent-light, rgba(0,113,227,0.10))", color: "var(--accent)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="5" width="18" height="14" rx="2" />
                          <path d="M3 10h18" />
                        </svg>
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text)" }}>{f.label}</div>
                        <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 3 }}>{f.subtitle}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  flex: 1, display: "flex", alignItems: "center", gap: 16,
                  padding: "20px 22px", borderRadius: 14,
                  background: "var(--panel-2, var(--card-bg))", border: "1px solid var(--card-border)",
                }}>
                  <div style={{
                    width: 50, height: 50, borderRadius: 12, flexShrink: 0,
                    background: "var(--accent-light, rgba(0,113,227,0.10))", color: "var(--accent)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="M3 10h18" />
                    </svg>
                  </div>
                  <div style={{ ...S.emptyState, fontSize: 13, padding: 0, textAlign: "left" as const }}>Flashcard sessions will show up here.</div>
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
