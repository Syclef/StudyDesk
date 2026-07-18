import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadAttemptDraft } from "./examStorage";
import type { ExamAttempt } from "./examTypes";

// Theme-aware colors (matches macOS light/dark)
function getTheme() {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  return {
    BG: isDark ? "#1c1c1e" : "#f5f5f7",
    CARD: isDark ? "#2c2c2e" : "#ffffff",
    TEXT: isDark ? "#f5f5f7" : "#1d1d1f",
    MUTED: isDark ? "#98989d" : "#6e6e73",
    BORDER: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
    ACCENT: isDark ? "#0a84ff" : "#0071e3",
    SUCCESS: isDark ? "#32d74b" : "#34c759",
    DANGER: isDark ? "#ff453a" : "#ff3b30",
    WARNING: isDark ? "#ff9f0a" : "#ff9500",
  };
}

const BG = "#1c1c1e";
const CARD = "#2c2c2e";
const TEXT = "#f5f5f7";
const MUTED = "#98989d";
const BORDER = "rgba(255,255,255,0.08)";
const ACCENT = "#0a84ff";
const SUCCESS = "#32d74b";
const DANGER = "#ff453a";
const WARNING = "#ff9f0a";

const DOMAIN_NAMES: Record<string, string> = {
  D1: "Information System Auditing Process",
  D2: "Governance and Management of IT",
  D3: "IS Acquisition, Development and Implementation",
  D4: "IS Operations and Business Resilience",
  D5: "Protection of Information Assets",
};

export default function ExamResultsPage() {
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState<ExamAttempt | null>(null);

  useEffect(() => {
    const draft = loadAttemptDraft();
    if (!draft) { navigate("/exam"); return; }
    setAttempt(draft);
  }, [navigate]);

  const stats = useMemo(() => {
    if (!attempt) return null;
    const total = attempt.questions.length;
    let correct = 0, unanswered = 0;
    for (const q of attempt.questions) {
      const answer = attempt.answers[q.id];
      if (!answer) unanswered++;
      else if (answer.choiceId === q.correctChoiceId) correct++;
    }
    const incorrect = total - correct - unanswered;
    const scorePercent = total > 0 ? Math.round((correct / total) * 100) : 0;
    return { total, correct, incorrect, unanswered, scorePercent };
  }, [attempt]);

  const domainStats = useMemo(() => {
    if (!attempt) return {};
    const map: Record<string, { correct: number; total: number }> = {};
    for (const q of attempt.questions) {
      const domain = `D${q.domain}`;
      if (!map[domain]) map[domain] = { correct: 0, total: 0 };
      map[domain].total++;
      const answer = attempt.answers[q.id];
      if (answer?.choiceId === q.correctChoiceId) map[domain].correct++;
    }
    return map;
  }, [attempt]);

  if (!attempt || !stats) return null;

  const { scorePercent, correct, incorrect, unanswered, total } = stats;
  const scoreColor = scorePercent >= 75 ? SUCCESS : scorePercent >= 60 ? WARNING : DANGER;
  const scoreLabel = scorePercent >= 75 ? "PASS" : scorePercent >= 60 ? "BORDERLINE" : "FAIL";

  const pageStyle = {
    minHeight: "100vh",
    background: BG,
    color: TEXT,
    padding: "32px",
    maxWidth: 720,
    margin: "0 auto",
  };

  return (
    <div style={pageStyle}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Exam Results</h1>
        <button
          onClick={() => navigate("/exam")}
          style={{ background: "none", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "6px 14px", color: TEXT, cursor: "pointer", fontSize: 13 }}
        >← Back</button>
      </div>

      {/* Score card */}
      <div style={{ background: CARD, borderRadius: 12, padding: 28, textAlign: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 64, fontWeight: 900, color: scoreColor, lineHeight: 1 }}>{scorePercent}%</div>
        <div style={{ marginTop: 8, fontSize: 16, fontWeight: 800, color: scoreColor }}>{scoreLabel}</div>
        <div style={{ marginTop: 12, fontSize: 13, color: MUTED }}>
          {correct} correct · {incorrect} incorrect · {unanswered} unanswered · {total} total
        </div>
        {attempt.finishedAt && (
          <div style={{ marginTop: 4, fontSize: 12, color: MUTED }}>
            Submitted {new Date(attempt.finishedAt).toLocaleString()}
          </div>
        )}
      </div>

      {/* Domain performance */}
      <div style={{ background: CARD, borderRadius: 12, padding: 20, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: MUTED, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Performance by Domain
        </div>
        {Object.entries(domainStats).sort().map(([domain, ds]) => {
          const pct = ds.total > 0 ? Math.round((ds.correct / ds.total) * 100) : 0;
          const barColor = pct >= 75 ? SUCCESS : pct >= 60 ? WARNING : DANGER;
          return (
            <div key={domain} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}>
                <span style={{ color: TEXT }}>{DOMAIN_NAMES[domain] ?? domain}</span>
                <span style={{ color: barColor, fontWeight: 700 }}>{pct}% ({ds.correct}/{ds.total})</span>
              </div>
              <div style={{ height: 8, borderRadius: 999, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: barColor, borderRadius: 999, transition: "width 0.4s" }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Passing threshold note */}
      <div style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${BORDER}`, borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontSize: 12, color: MUTED }}>
        <span style={{ color: SUCCESS, fontWeight: 700 }}>■</span> Pass ≥75% &nbsp;
        <span style={{ color: WARNING, fontWeight: 700 }}>■</span> Borderline 60–74% &nbsp;
        <span style={{ color: DANGER, fontWeight: 700 }}>■</span> Fail &lt;60%
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 12 }}>
        <button
          onClick={() => navigate("/exam/review")}
          style={{ background: ACCENT, color: "#fff", border: "none", borderRadius: 10, padding: "12px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}
        >Review Answers</button>
        <button
          onClick={() => navigate("/exam")}
          style={{ background: "none", color: MUTED, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "12px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}
        >Back to Exam</button>
      </div>
    </div>
  );
}
