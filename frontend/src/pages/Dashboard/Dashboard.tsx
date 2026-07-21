import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStudyProgress } from "../../utils/studyProgress";

const API_BASE = "http://127.0.0.1:4000";
const TOTAL_QUESTIONS = 1065;
const DEFAULT_EXAM_DATE = "2026-08-16";
const EXAM_DATE_KEY = "studydesk_exam_date";

interface AttemptSummary {
  id: string;
  mode: string;
  score: number | null;
  total: number | null;
  percent: number | null;
  startedAt: string;
  submittedAt: string | null;
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
    borderRadius: 12,
    padding: "18px 20px",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "space-between",
  } as React.CSSProperties,
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState<AttemptSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [examDate, setExamDate] = useState(() => localStorage.getItem(EXAM_DATE_KEY) ?? DEFAULT_EXAM_DATE);
  const [editingDate, setEditingDate] = useState(false);
  const [tempDate, setTempDate] = useState(examDate);

  useEffect(() => {
    fetch(`${API_BASE}/attempts`)
      .then((r) => r.json())
      .then((data: AttemptSummary[]) => { setAttempts(data); setLoading(false); })
      .catch(() => setLoading(false));
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
  const totalCorrect = submitted.reduce((s, a) => s + (a.score ?? 0), 0);
  const accuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;
  const progressPct = Math.min(Math.round((totalAttempted / TOTAL_QUESTIONS) * 100), 100);
  const dailyTarget = daysLeft > 0 ? Math.ceil(Math.max(TOTAL_QUESTIONS - totalAttempted, 0) / daysLeft) : 0;

  // Study module data
  const studyProgress = getStudyProgress();
  const studyCategories = Object.keys(studyProgress);
  const studiedCount = studyCategories.length;
  const studyAccuracy = studyCategories.length > 0
    ? Math.round(studyCategories.reduce((s, k) => s + (studyProgress[k].correct / Math.max(studyProgress[k].attempted, 1)), 0) / studyCategories.length * 100)
    : null;

  // Practice data
  const practiceAttempts = submitted.filter(a => a.mode === "STUDY" && (a.total ?? 0) >= 50);
  const lastPractice = practiceAttempts[0];

  // Exam data
  const examAttempts = submitted.filter(a => a.mode === "EXAM");
  const bestExam = examAttempts.length > 0 ? Math.max(...examAttempts.map(a => a.percent ?? 0)) : null;
  const lastExam = examAttempts[0];

  const accColor = accuracy >= 75 ? "var(--success,#34c759)" : accuracy >= 60 ? "var(--warning,#ff9500)" : accuracy > 0 ? "var(--danger,#ff3b30)" : "var(--text)";
  const examColor = bestExam === null ? "var(--muted)" : bestExam >= 75 ? "var(--success,#34c759)" : bestExam >= 60 ? "var(--warning,#ff9500)" : "var(--danger,#ff3b30)";

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      padding: "20px 28px",
      gap: 14,
      color: "var(--text)",
      boxSizing: "border-box",
      overflow: "hidden",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
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
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
        {/* Progress */}
        <div style={S.card}>
          <div style={S.label}>Progress</div>
          <div style={S.value}>{loading ? "—" : `${progressPct}%`}</div>
          <div style={S.sub}>{loading ? "" : `${totalAttempted.toLocaleString()} / ${TOTAL_QUESTIONS.toLocaleString()} questions`}</div>
          <div style={{ height: 3, borderRadius: 999, background: "var(--border)", overflow: "hidden", marginTop: 10 }}>
            <div style={{ height: "100%", width: `${progressPct}%`, background: "var(--accent)", borderRadius: 999 }} />
          </div>
        </div>

        {/* Accuracy */}
        <div style={S.card}>
          <div style={S.label}>Avg Accuracy</div>
          <div style={{ ...S.value, color: totalAttempted > 0 ? accColor : "var(--text)" }}>{loading ? "—" : totalAttempted > 0 ? `${accuracy}%` : "—"}</div>
          <div style={S.sub}>{totalAttempted > 0 ? `${totalCorrect.toLocaleString()} correct` : "No attempts yet"}</div>
          <div style={{ height: 3, borderRadius: 999, background: "var(--border)", overflow: "hidden", marginTop: 10 }}>
            <div style={{ height: "100%", width: `${accuracy}%`, background: accColor, borderRadius: 999 }} />
          </div>
        </div>

        {/* Days Left */}
        <div style={S.card}>
          <div style={S.label}>Days Left</div>
          <div style={{ ...S.value, color: daysLeft <= 14 && daysLeft > 0 ? "var(--danger,#ff3b30)" : "var(--text)" }}>{daysLeft}</div>
          <div style={S.sub}>Daily target: {loading ? "—" : `${dailyTarget} Qs`}</div>
        </div>

        {/* Best Exam */}
        <div style={S.card}>
          <div style={S.label}>Best Exam Score</div>
          <div style={{ ...S.value, color: examColor }}>{bestExam !== null ? `${bestExam}%` : "—"}</div>
          <div style={S.sub}>{examAttempts.length > 0 ? `${examAttempts.length} attempt${examAttempts.length > 1 ? "s" : ""}` : "No exams taken"}</div>
        </div>
      </div>

      {/* ── Row 2: Module Cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, flex: 1, minHeight: 0 }}>

        {/* Study */}
        <div style={{ ...S.card, cursor: "pointer", borderTop: "2px solid var(--accent)" }}
          onClick={() => navigate("/study")}
          onMouseEnter={e => e.currentTarget.style.background = "var(--panel-2,var(--card-bg))"}
          onMouseLeave={e => e.currentTarget.style.background = "var(--card-bg)"}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>Study</div>
            <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>Review by domain · per category · with explanations after each answer</div>
          </div>
          <div style={{ marginTop: 12 }}>
            {studiedCount > 0 ? (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--muted)", marginBottom: 4 }}>
                  <span>{studiedCount} categories studied</span>
                  {studyAccuracy !== null && <span style={{ fontWeight: 600, color: studyAccuracy >= 75 ? "var(--success,#34c759)" : studyAccuracy >= 60 ? "var(--warning,#ff9500)" : "var(--danger,#ff3b30)" }}>{studyAccuracy}% avg</span>}
                </div>
                <div style={{ height: 3, borderRadius: 999, background: "var(--border)", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${Math.round(studiedCount / 61 * 100)}%`, background: "var(--accent)", borderRadius: 999 }} />
                </div>
              </>
            ) : (
              <div style={{ fontSize: 11, color: "var(--muted)" }}>Not started yet</div>
            )}
            <div style={{ fontSize: 12, color: "var(--accent)", fontWeight: 500, marginTop: 8 }}>Open Study →</div>
          </div>
        </div>

        {/* Practice */}
        <div style={{ ...S.card, cursor: "pointer", borderTop: "2px solid var(--success,#34c759)" }}
          onClick={() => navigate("/practice")}
          onMouseEnter={e => e.currentTarget.style.background = "var(--panel-2,var(--card-bg))"}
          onMouseLeave={e => e.currentTarget.style.background = "var(--card-bg)"}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>Practice</div>
            <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>5 sets · 150 questions · no timer · see correct answers immediately</div>
          </div>
          <div style={{ marginTop: 12 }}>
            {lastPractice ? (
              <div style={{ fontSize: 11, color: "var(--muted)" }}>
                Last: <span style={{ fontWeight: 600, color: (lastPractice.percent ?? 0) >= 75 ? "var(--success,#34c759)" : "var(--warning,#ff9500)" }}>{lastPractice.percent}%</span>
                {" · "}{new Date(lastPractice.submittedAt!).toLocaleDateString()}
              </div>
            ) : (
              <div style={{ fontSize: 11, color: "var(--muted)" }}>No practice sessions yet</div>
            )}
            <div style={{ fontSize: 12, color: "var(--success,#34c759)", fontWeight: 500, marginTop: 8 }}>Open Practice →</div>
          </div>
        </div>

        {/* Exam */}
        <div style={{ ...S.card, cursor: "pointer", borderTop: "2px solid var(--warning,#ff9500)" }}
          onClick={() => navigate("/exam")}
          onMouseEnter={e => e.currentTarget.style.background = "var(--panel-2,var(--card-bg))"}
          onMouseLeave={e => e.currentTarget.style.background = "var(--card-bg)"}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>Exam</div>
            <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>5 sets · 150 questions · 4 hours · timed · no answers until submitted</div>
          </div>
          <div style={{ marginTop: 12 }}>
            {bestExam !== null ? (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--muted)" }}>
                  <span>{examAttempts.length} attempt{examAttempts.length > 1 ? "s" : ""}</span>
                  <span style={{ fontWeight: 600, color: examColor }}>Best: {bestExam}% {bestExam >= 75 ? "✓" : ""}</span>
                </div>
                {lastExam && (
                  <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
                    Last: {lastExam.percent}% · {formatDate(lastExam.submittedAt!)}
                  </div>
                )}
              </>
            ) : (
              <div style={{ fontSize: 11, color: "var(--muted)" }}>No exam attempts yet</div>
            )}
            <div style={{ fontSize: 12, color: "var(--warning,#ff9500)", fontWeight: 500, marginTop: 8 }}>Open Exam →</div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
