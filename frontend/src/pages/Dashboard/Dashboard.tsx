import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStudyProgress } from "../../utils/studyProgress";

const API_BASE = "http://127.0.0.1:4000";
const TOTAL_QUESTIONS = 1065;
const DEFAULT_EXAM_DATE = "2026-08-16";
const EXAM_DATE_KEY = "studydesk_exam_date";

const DOMAIN_NAMES: Record<string, string> = {
  D1: "Information System Auditing Process",
  D2: "Governance and Management of IT",
  D3: "IS Acquisition, Development & Implementation",
  D4: "IS Operations and Business Resilience",
  D5: "Protection of Information Assets",
};

interface AttemptSummary {
  id: string;
  mode: string;
  score: number | null;
  total: number | null;
  percent: number | null;
  startedAt: string;
  submittedAt: string | null;
}

interface CategorySummary {
  domain: string;
  categories: { name: string; count: number }[];
}

// Module accent colors — used only as a small identity dot + link color,
// never as a full border/stripe, so the three cards read as one family.
const MODULE_COLOR = {
  study: "var(--accent)",
  practice: "var(--success,#34c759)",
  exam: "var(--warning,#ff9500)",
};

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
    borderRadius: 12,
    padding: "18px 20px",
    display: "flex",
    flexDirection: "column" as const,
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

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState<AttemptSummary[]>([]);
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [examDate, setExamDate] = useState(() => localStorage.getItem(EXAM_DATE_KEY) ?? DEFAULT_EXAM_DATE);
  const [editingDate, setEditingDate] = useState(false);
  const [tempDate, setTempDate] = useState(examDate);

  useEffect(() => {
    fetch(`${API_BASE}/attempts`)
      .then((r) => r.json())
      .then((data: AttemptSummary[]) => { setAttempts(data); setLoading(false); })
      .catch(() => setLoading(false));

    fetch(`${API_BASE}/categories`)
      .then((r) => r.json())
      .then((data: CategorySummary[]) => setCategories(data))
      .catch(() => {});
  }, []);

  const saveDate = () => {
    if (!tempDate) return;
    localStorage.setItem(EXAM_DATE_KEY, tempDate);
    setExamDate(tempDate);
    setEditingDate(false);
  };

  // ── Metrics ─────────────────────────────────────────────────
  const now = new Date();
  const exam = new Date(examDate);
  const daysLeft = Math.max(Math.ceil((exam.getTime() - now.getTime()) / 86400000), 0);
  const submitted = attempts.filter(a => a.submittedAt);
  const totalAttempted = submitted.reduce((s, a) => s + (a.total ?? 0), 0);
  const progressPct = Math.min(Math.round((totalAttempted / TOTAL_QUESTIONS) * 100), 100);
  const dailyTarget = daysLeft > 0 ? Math.ceil(Math.max(TOTAL_QUESTIONS - totalAttempted, 0) / daysLeft) : 0;

  // Note: exam accuracy/best-score detail now lives only in the Exam card
  // (attempts, Best %, Last %) — the top row shows Best Exam Score as the
  // single headline readiness number instead of duplicating it here.
  const examAttempts = submitted.filter(a => a.mode === "EXAM");

  // Study module data
  const studyProgress = getStudyProgress();
  const studyCategories = Object.keys(studyProgress);
  const studiedCount = studyCategories.length;
  const studyAccuracy = studyCategories.length > 0
    ? Math.round(studyCategories.reduce((s, k) => s + (studyProgress[k].correct / Math.max(studyProgress[k].attempted, 1)), 0) / studyCategories.length * 100)
    : null;

  // Practice data
  // Practice data — PracticeSessionPage now creates real mode:"PRACTICE" attempts
  const practiceAttempts = submitted.filter(a => a.mode === "PRACTICE");
  const lastPractice = practiceAttempts[0];

  // Exam data
  const bestExam = examAttempts.length > 0 ? Math.max(...examAttempts.map(a => a.percent ?? 0)) : null;
  const lastExam = examAttempts[0];

  const examColor = bestExam === null ? "var(--muted)" : bestExam >= 75 ? "var(--success,#34c759)" : bestExam >= 60 ? "var(--warning,#ff9500)" : "var(--danger,#ff3b30)";

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  // ── Domain breakdown (fills the space below with real progress data) ──
  const domainRows = useMemo(() => {
    return Object.entries(DOMAIN_NAMES).map(([code, name]) => {
      const domainCategories = categories.find(c => c.domain === code)?.categories ?? [];
      const total = domainCategories.reduce((s, c) => s + c.count, 0);
      const attempted = domainCategories.reduce((s, c) => s + (studyProgress[c.name]?.attempted ?? 0), 0);
      const correct = domainCategories.reduce((s, c) => s + (studyProgress[c.name]?.correct ?? 0), 0);
      const pct = total > 0 ? Math.round((attempted / total) * 100) : 0;
      const acc = attempted > 0 ? Math.round((correct / attempted) * 100) : null;
      return { code, name, pct, acc, attempted, total };
    });
  }, [categories, studyProgress]);

  const hasAnyDomainData = domainRows.some(d => d.attempted > 0);

  return (
    <div style={{
      minHeight: "100vh",
      padding: "20px clamp(20px, 4vw, 64px) 40px",
      color: "var(--text)",
      boxSizing: "border-box",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
      display: "flex",
      flexDirection: "column",
      gap: 14,
      width: "100%",
    }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 600, margin: 0, letterSpacing: "-0.3px", color: "var(--text)" }}>
            Good {now.getHours() < 12 ? "morning" : now.getHours() < 17 ? "afternoon" : "evening"} 👋
          </h1>
          <p style={{ fontSize: 12, color: "var(--muted)", margin: "2px 0 0 0" }}>Here's your CISA prep at a glance</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {editingDate ? (
            <>
              <input type="date" value={tempDate} onChange={e => setTempDate(e.target.value)}
                style={{ fontSize: 12, padding: "4px 8px", borderRadius: 6, border: "1px solid var(--input-border)", background: "var(--input-bg)", color: "var(--text)" }} />
              <button onClick={saveDate} style={{ background: "var(--accent)", color: "#fff", border: "none", borderRadius: 6, padding: "4px 10px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Save</button>
              <button onClick={() => { setTempDate(examDate); setEditingDate(false); }} style={{ background: "none", color: "var(--muted)", border: "1px solid var(--border)", borderRadius: 6, padding: "4px 8px", fontSize: 12, cursor: "pointer" }}>Cancel</button>
            </>
          ) : (
            <>
              <span style={{ fontSize: 12, color: "var(--muted)" }}>
                Exam: <strong style={{ color: "var(--text)", fontWeight: 600 }}>{formatDate(examDate)}</strong>
              </span>
              <button onClick={() => { setTempDate(examDate); setEditingDate(true); }}
                style={{ background: "none", border: "1px solid var(--border)", borderRadius: 6, padding: "3px 8px", fontSize: 11, color: "var(--muted)", cursor: "pointer" }}>
                Edit
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── Row 1: Stats ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
        <div style={S.card}>
          <div style={S.label}>Progress</div>
          <div style={S.value}>{loading ? "—" : `${progressPct}%`}</div>
          <div style={S.sub}>{loading ? "" : `${totalAttempted.toLocaleString()} / ${TOTAL_QUESTIONS.toLocaleString()} questions`}</div>
          <div style={{ height: 3, borderRadius: 999, background: "var(--border)", overflow: "hidden", marginTop: 10 }}>
            <div style={{ height: "100%", width: `${progressPct}%`, background: "var(--accent)", borderRadius: 999 }} />
          </div>
        </div>

        <div style={S.card}>
          <div style={S.label}>Days Left</div>
          <div style={{ ...S.value, color: daysLeft <= 14 && daysLeft > 0 ? "var(--danger,#ff3b30)" : "var(--text)" }}>{daysLeft}</div>
          <div style={S.sub}>Daily target: {loading ? "—" : `${dailyTarget} Qs`}</div>
        </div>

        <div style={S.card}>
          <div style={S.label}>Best Exam Score</div>
          <div style={{ ...S.value, color: examColor }}>{bestExam !== null ? `${bestExam}%` : "—"}</div>
          <div style={S.sub}>{examAttempts.length > 0 ? `${examAttempts.length} attempt${examAttempts.length > 1 ? "s" : ""}` : "No exams taken"}</div>
        </div>
      </div>

      {/* ── Row 2: Module Cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 10, alignItems: "start" }}>

        {/* Study */}
        <div style={{ ...S.card, cursor: "pointer", transition: "border-color .15s, background .15s" }}
          onClick={() => navigate("/study")}
          onMouseEnter={e => { e.currentTarget.style.background = "var(--panel-2,var(--card-bg))"; e.currentTarget.style.borderColor = MODULE_COLOR.study; }}
          onMouseLeave={e => { e.currentTarget.style.background = "var(--card-bg)"; e.currentTarget.style.borderColor = "var(--card-border)"; }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 4, display: "flex", alignItems: "center" }}>
              <span style={S.dot(MODULE_COLOR.study)} />Study
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>Review by domain · per category · with explanations after each answer</div>
          </div>
          {studiedCount > 0 ? (
            <div style={{ marginTop: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--muted)", marginBottom: 4 }}>
                <span>{studiedCount} categories studied</span>
                {studyAccuracy !== null && <span style={{ fontWeight: 600, color: studyAccuracy >= 75 ? "var(--success,#34c759)" : studyAccuracy >= 60 ? "var(--warning,#ff9500)" : "var(--danger,#ff3b30)" }}>{studyAccuracy}% avg</span>}
              </div>
              <div style={{ height: 3, borderRadius: 999, background: "var(--border)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${Math.round(studiedCount / 61 * 100)}%`, background: MODULE_COLOR.study, borderRadius: 999 }} />
              </div>
            </div>
          ) : (
            <div style={S.emptyState}>Not started yet</div>
          )}
        </div>

        {/* Practice */}
        <div style={{ ...S.card, cursor: "pointer", transition: "border-color .15s, background .15s" }}
          onClick={() => navigate("/practice")}
          onMouseEnter={e => { e.currentTarget.style.background = "var(--panel-2,var(--card-bg))"; e.currentTarget.style.borderColor = MODULE_COLOR.practice; }}
          onMouseLeave={e => { e.currentTarget.style.background = "var(--card-bg)"; e.currentTarget.style.borderColor = "var(--card-border)"; }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 4, display: "flex", alignItems: "center" }}>
              <span style={S.dot(MODULE_COLOR.practice)} />Practice
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>5 sets · 150 questions · no timer · see correct answers immediately</div>
          </div>
          {lastPractice ? (
            <div style={{ marginTop: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--muted)" }}>
                <span>{practiceAttempts.length} session{practiceAttempts.length > 1 ? "s" : ""}</span>
                <span>
                  Last: <span style={{ fontWeight: 600, color: (lastPractice.percent ?? 0) >= 75 ? "var(--success,#34c759)" : "var(--warning,#ff9500)" }}>{lastPractice.percent}%</span>
                </span>
              </div>
              <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{new Date(lastPractice.submittedAt!).toLocaleDateString()}</div>
            </div>
          ) : (
            <div style={S.emptyState}>No practice sessions yet</div>
          )}
        </div>

        {/* Exam */}
        <div style={{ ...S.card, cursor: "pointer", transition: "border-color .15s, background .15s" }}
          onClick={() => navigate("/exam")}
          onMouseEnter={e => { e.currentTarget.style.background = "var(--panel-2,var(--card-bg))"; e.currentTarget.style.borderColor = MODULE_COLOR.exam; }}
          onMouseLeave={e => { e.currentTarget.style.background = "var(--card-bg)"; e.currentTarget.style.borderColor = "var(--card-border)"; }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 4, display: "flex", alignItems: "center" }}>
              <span style={S.dot(MODULE_COLOR.exam)} />Exam
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>5 sets · 150 questions · 4 hours · timed · no answers until submitted</div>
          </div>
          {bestExam !== null ? (
            <div style={{ marginTop: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--muted)" }}>
                <span>{examAttempts.length} attempt{examAttempts.length > 1 ? "s" : ""}</span>
                <span style={{ fontWeight: 600, color: examColor }}>Best: {bestExam}% {bestExam >= 75 ? "✓" : ""}</span>
              </div>
              {lastExam && (
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
                  Last: {lastExam.percent}% · {formatDate(lastExam.submittedAt!)}
                </div>
              )}
            </div>
          ) : (
            <div style={S.emptyState}>No exam attempts yet</div>
          )}
        </div>
      </div>

      {/* ── Row 3: Domain Breakdown — fills the remaining space with real progress data ── */}
      <div style={S.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>Domain Breakdown</div>
          <div style={{ fontSize: 11, color: "var(--muted)" }}>{TOTAL_QUESTIONS.toLocaleString()} questions across 5 domains</div>
        </div>

        {hasAnyDomainData ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {domainRows.map(d => (
              <div key={d.code}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}>
                  <span style={{ color: "var(--text)" }}>
                    <span style={{ color: "var(--muted)", fontWeight: 600, marginRight: 6 }}>{d.code}</span>
                    {d.name}
                  </span>
                  <span style={{ color: "var(--muted)" }}>
                    {d.attempted}/{d.total}
                    {d.acc !== null && (
                      <strong style={{ marginLeft: 8, color: d.acc >= 75 ? "var(--success,#34c759)" : d.acc >= 60 ? "var(--warning,#ff9500)" : "var(--danger,#ff3b30)" }}>
                        {d.acc}%
                      </strong>
                    )}
                  </span>
                </div>
                <div style={{ height: 4, borderRadius: 999, background: "var(--border)", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${d.pct}%`, background: "var(--accent)", borderRadius: 999 }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={S.emptyState}>Start studying a category to see your domain-by-domain breakdown here.</div>
        )}
      </div>

    </div>
  );
};

export default Dashboard;
