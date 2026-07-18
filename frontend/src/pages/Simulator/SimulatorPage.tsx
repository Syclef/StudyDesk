import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { recordStudyResult } from "../../utils/studyProgress";

const API_BASE = "http://127.0.0.1:4000";

const BG = "#0f1b2d";
const CARD = "#1a2540";
const TEXT = "#e5eaf1";
const MUTED = "#94a3b8";
const BORDER = "rgba(255,255,255,0.10)";
const ACCENT = "#3b82f6";
const SUCCESS = "#4ade80";
const DANGER = "#f87171";

// Renders question text with bullet formatting for scenario-type questions
function renderQuestionText(text: string, color: string): React.ReactNode {
  // Split on " - " followed by capital letter (scenario bullet pattern)
  const parts = text.split(/ - (?=[A-Z])/);
  if (parts.length <= 1) return <span style={{ color }}>{text}</span>;

  // The last part may contain "final bullet. Question stem"
  // Split last part at ". Capital" to separate bullet from stem
  const lastPart = parts[parts.length - 1];
  const stemMatch = lastPart.match(/^(.*?)\. ([A-Z].+[?:])$/s);

  const bullets = stemMatch
    ? [...parts.slice(1, -1), stemMatch[1]]
    : parts.slice(1);
  const stem = stemMatch ? stemMatch[2] : null;

  return (
    <div>
      <p style={{ margin: "0 0 10px 0", color }}>{parts[0]}</p>
      <ul style={{ margin: "0 0 10px 0", paddingLeft: 20, color }}>
        {bullets.map((p, i) => (
          <li key={i} style={{ marginBottom: 6, lineHeight: 1.5 }}>{p}</li>
        ))}
      </ul>
      {stem && <p style={{ margin: 0, color }}>{stem}</p>}
      {!stem && !stemMatch && <p style={{ margin: 0, color }}>{lastPart}</p>}
    </div>
  );
}

interface Choice {
  id: string;
  label: string;
  text: string;
  isCorrect: boolean;
  justification: string | null;
}

interface ApiQuestion {
  order: number;
  id: string;
  domain: string;
  category: string;
  text: string;
  choices: Choice[];
}

interface SessionState {
  attemptId: string;
  questions: ApiQuestion[];
  total: number;
}

const SimulatorPage = () => {
  const { id } = useParams<{ mode: string; id: string }>();
  const navigate = useNavigate();

  const [session, setSession] = useState<SessionState | null>(null);
  const [idx, setIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);

  const categoryName = id ? decodeURIComponent(id) : "Study";

  useEffect(() => {
    async function startSession() {
      try {
        const res = await fetch(`${API_BASE}/attempts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: "STUDY",
            category: id ? decodeURIComponent(id) : undefined,
            durationSec: 3600,
          }),
        });
        if (!res.ok) throw new Error("Failed to start session");
        const data = await res.json();
        setSession({ attemptId: data.attemptId, questions: data.questions, total: data.total });
        setLoading(false);
      } catch (err) {
        setError("Could not load questions. Make sure the API is running.");
        setLoading(false);
      }
    }
    startSession();
  }, [id]);

  useEffect(() => {
    if (progressFillRef.current && session) {
      const pct = ((idx + 1) / session.total) * 100;
      progressFillRef.current.style.width = `${pct}%`;
    }
  }, [idx, session]);

  const currentQuestion = session?.questions[idx] ?? null;

  const handleCheckAnswer = async () => {
    if (!session || !currentQuestion || !selectedOption) return;
    const choice = currentQuestion.choices.find((c) => c.label === selectedOption);
    if (!choice) return;
    if (choice.isCorrect) setCorrectCount((n) => n + 1);
    try {
      await fetch(`${API_BASE}/attempts/${session.attemptId}/answers/${currentQuestion.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ choiceLabel: selectedOption }),
      });
    } catch (err) {
      console.error("Failed to record answer:", err);
    }
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (!session) return;
    if (idx + 1 >= session.total) {
      recordStudyResult(categoryName, correctCount, session.total);
      fetch(`${API_BASE}/attempts/${session.attemptId}/submit`, { method: "POST" })
        .finally(() => navigate("/study"));
      return;
    }
    setIdx((i) => i + 1);
    setSelectedOption(null);
    setShowExplanation(false);
  };

  const handleSkip = () => {
    if (!session) return;
    if (idx + 1 >= session.total) {
      recordStudyResult(categoryName, correctCount, session.total);
      navigate("/study");
      return;
    }
    setIdx((i) => i + 1);
    setSelectedOption(null);
    setShowExplanation(false);
  };

  const pageStyle: React.CSSProperties = {
    minHeight: "100vh",
    background: BG,
    color: TEXT,
    padding: "24px 32px",
    maxWidth: 860,
    margin: "0 auto",
  };

  if (loading) return <div style={pageStyle}><p style={{ color: MUTED }}>Loading questions...</p></div>;
  if (error) return (
    <div style={pageStyle}>
      <p style={{ color: DANGER }}>{error}</p>
      <button onClick={() => navigate("/study")} style={{ color: ACCENT, background: "none", border: "none", cursor: "pointer" }}>Go back</button>
    </div>
  );
  if (!session || !currentQuestion) return (
    <div style={pageStyle}>
      <p style={{ color: MUTED }}>No questions found.</p>
      <button onClick={() => navigate("/study")} style={{ color: ACCENT, background: "none", border: "none", cursor: "pointer" }}>Go back</button>
    </div>
  );

  const selectedChoice = currentQuestion.choices.find((c) => c.label === selectedOption);
  const isCorrect = selectedChoice?.isCorrect ?? false;

  return (
    <div style={pageStyle}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{categoryName}</h1>
        <button
          onClick={() => navigate("/study")}
          style={{ background: "none", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "6px 14px", color: TEXT, cursor: "pointer", fontSize: 13 }}
        >Exit</button>
      </div>

      {/* Progress */}
      <div style={{ fontSize: 12, color: MUTED, marginBottom: 6 }}>Question {idx + 1} of {session.total}</div>
      <div style={{ width: "100%", height: 6, borderRadius: 999, background: "rgba(255,255,255,0.08)", marginBottom: 20, overflow: "hidden" }}>
        <div ref={progressFillRef} style={{ height: "100%", background: ACCENT, borderRadius: 999, width: "0%", transition: "width 0.2s" }} />
      </div>

      {/* Question card */}
      <div style={{ background: CARD, borderRadius: 12, padding: 24, marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: MUTED, marginBottom: 8 }}>
          {currentQuestion.domain} · {currentQuestion.category}
        </div>

        <div style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.6, marginBottom: 20 }}>
          {renderQuestionText(currentQuestion.text, TEXT)}
        </div>

        {/* Correct/Incorrect banner */}
        {showExplanation && (
          <div style={{ fontSize: 13, fontWeight: 600, color: isCorrect ? SUCCESS : DANGER, marginBottom: 12 }}>
            {isCorrect ? "✓ Your answer is correct!" : "✗ Your answer is incorrect"}
          </div>
        )}

        {/* Choices */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {currentQuestion.choices.map((choice) => {
            const isSelected = selectedOption === choice.label;
            const isCorrectChoice = choice.isCorrect;

            let bg = "rgba(255,255,255,0.04)";
            let border = BORDER;
            let color = TEXT;

            if (showExplanation) {
              if (isCorrectChoice) { bg = "rgba(74,222,128,0.12)"; border = SUCCESS; }
              else if (isSelected) { bg = "rgba(248,113,113,0.12)"; border = DANGER; }
              else { color = MUTED; }
            } else if (isSelected) {
              bg = "rgba(59,130,246,0.15)";
              border = ACCENT;
            }

            const hasJustification = showExplanation && choice.justification;

            const choiceTag = showExplanation && isSelected && isCorrectChoice
              ? <span style={{ color: SUCCESS, fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>Your answer is correct</span>
              : showExplanation && isSelected && !isCorrectChoice
              ? <span style={{ color: DANGER, fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>Your answer is incorrect</span>
              : showExplanation && !isSelected && isCorrectChoice
              ? <span style={{ color: SUCCESS, fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>Correct answer</span>
              : null;

            return (
              <div key={choice.id} style={{ display: "flex", flexDirection: "column" }}>
                <div
                  onClick={() => !showExplanation && setSelectedOption(choice.label)}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "14px 16px",
                    borderRadius: hasJustification ? "8px 8px 0 0" : 8,
                    border: `1px solid ${border}`,
                    background: bg, color,
                    cursor: showExplanation ? "default" : "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  <span style={{ fontWeight: 700, flexShrink: 0, width: 20 }}>{choice.label}</span>
                  <span style={{ flex: 1, fontSize: 14, lineHeight: 1.5 }}>{choice.text}</span>
                  {choiceTag}
                </div>

                {hasJustification && (
                  <div style={{
                    padding: "10px 16px",
                    background: "rgba(255,255,255,0.03)",
                    border: `1px solid ${border}`,
                    borderTop: "none",
                    borderRadius: "0 0 8px 8px",
                    fontSize: 12, color: MUTED, lineHeight: 1.5,
                  }}>
                    <span style={{ color: TEXT }}>Explanation:</span> {choice.justification}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {!showExplanation ? (
          <button
            onClick={handleSkip}
            style={{ background: "none", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "10px 20px", fontSize: 13, color: MUTED, cursor: "pointer" }}
          >Skip question</button>
        ) : <div />}

        {!showExplanation ? (
          <button
            disabled={!selectedOption}
            onClick={handleCheckAnswer}
            style={{
              background: selectedOption ? ACCENT : "rgba(255,255,255,0.08)",
              border: "none", borderRadius: 8, padding: "10px 28px",
              fontSize: 14, fontWeight: 600,
              color: selectedOption ? "#fff" : MUTED,
              cursor: selectedOption ? "pointer" : "not-allowed",
            }}
          >Check Answer</button>
        ) : (
          <button
            onClick={handleNext}
            style={{ background: ACCENT, border: "none", borderRadius: 8, padding: "10px 28px", fontSize: 14, fontWeight: 600, color: "#fff", cursor: "pointer" }}
          >{idx + 1 < session.total ? "Next Question" : "Finish"}</button>
        )}
      </div>
    </div>
  );
};

export default SimulatorPage;
