import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadAttemptDraft } from "./examStorage";
import type { ExamAttempt, ExamQuestion } from "./examTypes";

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

function renderQuestionText(text: string): React.ReactNode {
  if (!text.includes('\n')) return <span>{text}</span>;
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  return (
    <div>
      {lines.map((line, i) => {
        if (line.startsWith('- ') || line.startsWith('• ')) {
          return (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
              <span style={{ flexShrink: 0 }}>•</span>
              <span>{line.replace(/^[-•]\s*/, '')}</span>
            </div>
          );
        }
        return <p key={i} style={{ margin: i === lines.length - 1 ? 0 : '0 0 6px 0' }}>{line}</p>;
      })}
    </div>
  );
}

export default function ExamReviewPage() {
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState<ExamAttempt | null>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const draft = loadAttemptDraft();
    if (!draft) { navigate("/exam"); return; }
    setAttempt(draft);
  }, [navigate]);

  if (!attempt) return null;

  const total = attempt.questions.length;
  const correct = attempt.questions.filter(q => attempt.answers[q.id]?.choiceId === q.correctChoiceId).length;
  const scorePercent = total > 0 ? Math.round((correct / total) * 100) : 0;
  const scoreColor = scorePercent >= 75 ? SUCCESS : scorePercent >= 60 ? WARNING : DANGER;

  const q: ExamQuestion = attempt.questions[index];
  const userAnswer = attempt.answers[q.id];
  const userChoiceId = userAnswer?.choiceId ?? null;
  const isCorrect = userChoiceId === q.correctChoiceId;
  const isFlagged = !!attempt.flagged[q.id];

  const pageStyle: React.CSSProperties = {
    minHeight: "100vh",
    background: BG,
    color: TEXT,
    padding: "24px 32px",
    maxWidth: 900,
    margin: "0 auto",
  };

  return (
    <div style={pageStyle}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Review Answers</h1>
          <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>
            Question {index + 1} of {total} · Score: <span style={{ color: scoreColor, fontWeight: 700 }}>{scorePercent}%</span>
          </div>
        </div>
        <button
          onClick={() => navigate("/exam/results")}
          style={{ background: "none", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "6px 14px", color: TEXT, cursor: "pointer", fontSize: 13 }}
        >← Results</button>
      </div>

      {/* Question card */}
      <div style={{ background: CARD, borderRadius: 12, padding: 24, marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: MUTED, marginBottom: 8, display: "flex", gap: 10 }}>
          <span>D{q.domain}</span>
          {q.ks && <span>· {q.ks}</span>}
          {isFlagged && <span style={{ color: WARNING }}>⚑ Flagged</span>}
        </div>

        <div style={{ fontSize: 15, fontWeight: 500, lineHeight: 1.6, marginBottom: 20, color: TEXT }}>
          {renderQuestionText(q.text)}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {q.choices.map((c) => {
            const isSelected = c.id === userChoiceId;
            const isCorrectChoice = c.id === q.correctChoiceId;

            let bg = "rgba(255,255,255,0.04)";
            let border = BORDER;
            let color = MUTED;

            if (isCorrectChoice) { bg = "rgba(74,222,128,0.12)"; border = SUCCESS; color = TEXT; }
            if (isSelected && !isCorrectChoice) { bg = "rgba(248,113,113,0.12)"; border = DANGER; color = TEXT; }

            const tag = isSelected && isCorrectChoice
              ? <span style={{ color: SUCCESS, fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>✓ Your answer</span>
              : isSelected && !isCorrectChoice
              ? <span style={{ color: DANGER, fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>✗ Your answer</span>
              : isCorrectChoice
              ? <span style={{ color: SUCCESS, fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>Correct answer</span>
              : null;

            return (
              <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 8, border: `1px solid ${border}`, background: bg, color }}>
                <span style={{ fontWeight: 700, flexShrink: 0, width: 20 }}>{c.label}</span>
                <span style={{ flex: 1, fontSize: 14, lineHeight: 1.5 }}>{c.text}</span>
                {tag}
              </div>
            );
          })}
        </div>

        {/* Explanation */}
        {q.explanation && (
          <div style={{ marginTop: 16, padding: "12px 16px", borderRadius: 8, background: "rgba(255,255,255,0.03)", border: `1px solid ${BORDER}`, fontSize: 12, color: MUTED, lineHeight: 1.5 }}>
            <span style={{ color: TEXT }}>Explanation:</span> {q.explanation}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <button
          onClick={() => setIndex(i => Math.max(0, i - 1))}
          disabled={index === 0}
          style={{ background: "none", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "8px 18px", color: index === 0 ? "rgba(255,255,255,0.2)" : TEXT, cursor: index === 0 ? "not-allowed" : "pointer", fontSize: 13 }}
        >‹ Prev</button>

        <button
          onClick={() => setIndex(i => Math.min(total - 1, i + 1))}
          disabled={index === total - 1}
          style={{ background: ACCENT, border: "none", borderRadius: 8, padding: "8px 18px", color: "#fff", cursor: index === total - 1 ? "not-allowed" : "pointer", fontSize: 13, fontWeight: 600, opacity: index === total - 1 ? 0.4 : 1 }}
        >Next ›</button>
      </div>

      {/* Question grid */}
      <div style={{ background: CARD, borderRadius: 12, padding: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: MUTED, marginBottom: 10 }}>Jump to Question</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {attempt.questions.map((qq, i) => {
            const ans = attempt.answers[qq.id];
            const isAnswered = !!ans?.choiceId;
            const isRight = ans?.choiceId === qq.correctChoiceId;
            const isFl = !!attempt.flagged[qq.id];
            const isCurrent = i === index;

            let bg = "rgba(255,255,255,0.06)";
            let border = BORDER;
            if (isAnswered && isRight) { bg = "rgba(74,222,128,0.15)"; border = SUCCESS; }
            if (isAnswered && !isRight) { bg = "rgba(248,113,113,0.15)"; border = DANGER; }
            if (isFl) { bg = "rgba(251,191,36,0.15)"; border = WARNING; }

            return (
              <button
                key={qq.id}
                onClick={() => setIndex(i)}
                style={{
                  width: 34, height: 34, borderRadius: 8,
                  fontSize: 11, fontWeight: 700, cursor: "pointer",
                  border: isCurrent ? `2px solid ${ACCENT}` : `1px solid ${border}`,
                  background: bg, color: TEXT,
                }}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
