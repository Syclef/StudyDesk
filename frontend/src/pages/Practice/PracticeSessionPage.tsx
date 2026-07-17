import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/practice-session.css";

type Phase = "loading" | "error" | "active" | "checked" | "results";

interface Choice {
  id: string;
  label: string;
  text: string;
  isCorrect: boolean;
  justification: string | null;
}

interface Question {
  id: string;
  domain: string;
  category: string;
  text: string;
  choices: Choice[];
}

interface Answer {
  questionId: string;
  choiceId: string;
  isCorrect: boolean;
}

const API_BASE = "http://127.0.0.1:4000";

// CISA domain weights
const CISA_WEIGHTS: Record<string, number> = {
  D1: 0.21,
  D2: 0.17,
  D3: 0.12,
  D4: 0.23,
  D5: 0.27,
};

const TOTAL = 150;

const BG = "#0f1b2d";
const CARD = "#1a2540";
const TEXT = "#e5eaf1";
const MUTED = "#94a3b8";
const BORDER = "rgba(255,255,255,0.10)";
const ACCENT = "#3b82f6";
const SUCCESS = "#4ade80";
const DANGER = "#f87171";

function renderQuestionText(text: string, color: string): React.ReactNode {
  // Check if text contains newlines (scenario/bullet format)
  if (!text.includes('\n')) return <span style={{ color }}>{text}</span>;

  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  
  return (
    <div>
      {lines.map((line, i) => {
        if (line.startsWith('- ') || line.startsWith('• ')) {
          return (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, color }}>
              <span style={{ flexShrink: 0 }}>•</span>
              <span style={{ lineHeight: 1.5 }}>{line.replace(/^[-•]\s*/, '')}</span>
            </div>
          );
        }
        return (
          <p key={i} style={{ margin: i === lines.length - 1 ? 0 : '0 0 8px 0', color, lineHeight: 1.6 }}>
            {line}
          </p>
        );
      })}
    </div>
  );
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildWeightedSet(all: Question[]): Question[] {
  const byDomain: Record<string, Question[]> = {};
  for (const q of all) {
    if (!byDomain[q.domain]) byDomain[q.domain] = [];
    byDomain[q.domain].push(q);
  }

  const selected: Question[] = [];
  for (const [domain, weight] of Object.entries(CISA_WEIGHTS)) {
    const target = Math.round(TOTAL * weight);
    const pool = shuffle(byDomain[domain] ?? []);
    selected.push(...pool.slice(0, Math.min(target, pool.length)));
  }

  // Pad if short
  if (selected.length < TOTAL) {
    const selectedIds = new Set(selected.map((q) => q.id));
    const leftover = shuffle(all.filter((q) => !selectedIds.has(q.id)));
    selected.push(...leftover.slice(0, TOTAL - selected.length));
  }

  return shuffle(selected).slice(0, TOTAL);
}

export default function PracticeSessionPage() {
  const { category: setParam } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const setNumber = setParam ?? "1";

  const [phase, setPhase] = useState<Phase>("loading");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const progressFillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPhase("loading");
    fetch(`${API_BASE}/questions`)
      .then((r) => r.json())
      .then((data: Question[]) => {
        setQuestions(buildWeightedSet(data));
        setIndex(0);
        setSelectedChoiceId(null);
        setAnswers([]);
        setPhase("active");
      })
      .catch(() => setPhase("error"));
  }, [setNumber]);

  useEffect(() => {
    if (progressFillRef.current && questions.length > 0) {
      const pct = Math.round((index / questions.length) * 100);
      progressFillRef.current.style.width = `${pct}%`;
    }
  }, [index, questions.length]);

  const currentQuestion = questions[index];
  const correctCount = answers.filter((a) => a.isCorrect).length;

  const handleSelect = (choiceId: string) => {
    if (phase === "checked") return;
    setSelectedChoiceId(choiceId);
  };

  const handleCheck = () => {
    if (!currentQuestion || !selectedChoiceId) return;
    setPhase("checked");
  };

  const handleNext = () => {
    if (!currentQuestion || !selectedChoiceId) return;
    const choice = currentQuestion.choices.find((c) => c.id === selectedChoiceId);
    setAnswers((prev) => [...prev, {
      questionId: currentQuestion.id,
      choiceId: selectedChoiceId,
      isCorrect: choice?.isCorrect ?? false,
    }]);
    setSelectedChoiceId(null);
    if (index + 1 < questions.length) {
      setIndex(index + 1);
      setPhase("active");
    } else {
      setPhase("results");
    }
  };

  const handleSkip = () => {
    if (!currentQuestion) return;
    setAnswers((prev) => [...prev, { questionId: currentQuestion.id, choiceId: "", isCorrect: false }]);
    setSelectedChoiceId(null);
    if (index + 1 < questions.length) {
      setIndex(index + 1);
      setPhase("active");
    } else {
      setPhase("results");
    }
  };

  const handleRetry = () => {
    fetch(`${API_BASE}/questions`)
      .then((r) => r.json())
      .then((data: Question[]) => {
        setQuestions(buildWeightedSet(data));
        setIndex(0);
        setSelectedChoiceId(null);
        setAnswers([]);
        setPhase("active");
      });
  };

  const pageStyle: React.CSSProperties = {
    minHeight: "100vh",
    background: BG,
    color: TEXT,
    padding: "24px 32px",
    maxWidth: 860,
    margin: "0 auto",
  };

  if (phase === "loading") return (
    <div style={pageStyle}><p style={{ color: MUTED }}>Loading questions…</p></div>
  );

  if (phase === "error") return (
    <div style={pageStyle}>
      <p style={{ color: DANGER }}>Couldn't load questions. Is the API running?</p>
      <button onClick={() => navigate("/practice")} style={{ color: ACCENT, background: "none", border: "none", cursor: "pointer" }}>Back to Practice</button>
    </div>
  );

  // ── Results ──────────────────────────────────────────────────────────────
  if (phase === "results") {
    const total = questions.length;
    const scorePct = total > 0 ? Math.round((correctCount / total) * 100) : 0;

    // Domain breakdown
    const domainStats: Record<string, { correct: number; total: number }> = {};
    questions.forEach((q, i) => {
      if (!domainStats[q.domain]) domainStats[q.domain] = { correct: 0, total: 0 };
      domainStats[q.domain].total++;
      if (answers[i]?.isCorrect) domainStats[q.domain].correct++;
    });

    return (
      <div style={pageStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Practice Set {setNumber} — Results</h1>
          <button onClick={() => navigate("/practice")} style={{ background: "none", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "6px 14px", color: TEXT, cursor: "pointer" }}>Back to Practice</button>
        </div>

        <div style={{ background: CARD, borderRadius: 12, padding: 24, textAlign: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 48, fontWeight: 900, color: scorePct >= 75 ? SUCCESS : scorePct >= 60 ? "#fbbf24" : DANGER }}>{scorePct}%</div>
          <div style={{ color: MUTED, fontSize: 14 }}>{correctCount} of {total} correct</div>
          <div style={{ marginTop: 8, fontSize: 13, fontWeight: 700, color: scorePct >= 75 ? SUCCESS : DANGER }}>
            {scorePct >= 75 ? "PASS" : "FAIL"}
          </div>
        </div>

        {/* Domain breakdown */}
        <div style={{ background: CARD, borderRadius: 12, padding: 20, marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: MUTED, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>Performance by Domain</div>
          {Object.entries(domainStats).sort().map(([domain, stats]) => {
            const pct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
            return (
              <div key={domain} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: TEXT }}>{domain}</span>
                  <span style={{ color: pct >= 75 ? SUCCESS : pct >= 60 ? "#fbbf24" : DANGER, fontWeight: 700 }}>{pct}% ({stats.correct}/{stats.total})</span>
                </div>
                <div style={{ height: 6, borderRadius: 999, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: pct >= 75 ? SUCCESS : pct >= 60 ? "#fbbf24" : DANGER, borderRadius: 999, transition: "width 0.3s" }} />
                </div>
              </div>
            );
          })}
        </div>

        <button onClick={handleRetry} style={{ display: "block", margin: "0 auto 24px", background: "none", border: `1px solid ${ACCENT}`, borderRadius: 8, padding: "8px 20px", color: ACCENT, cursor: "pointer", fontWeight: 600 }}>
          Retry Set
        </button>

        {/* Question review */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {questions.map((q, i) => {
            const answer = answers[i];
            const correctChoice = q.choices.find((c) => c.isCorrect);
            const chosenChoice = q.choices.find((c) => c.id === answer?.choiceId);
            const skipped = !answer?.choiceId;
            const borderColor = skipped ? MUTED : answer?.isCorrect ? SUCCESS : DANGER;
            return (
              <div key={q.id} style={{ background: CARD, borderRadius: 8, padding: "14px 16px", borderLeft: `4px solid ${borderColor}` }}>
                <div style={{ fontSize: 11, color: MUTED, marginBottom: 4 }}>{q.domain} · {q.category}</div>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>{i + 1}. {renderQuestionText(q.text, TEXT)}</div>
                {skipped ? (
                  <div style={{ color: MUTED, fontSize: 13 }}>Skipped</div>
                ) : (
                  <div style={{ fontSize: 13, color: MUTED }}>Your answer: {chosenChoice?.label}. {chosenChoice?.text}</div>
                )}
                {!answer?.isCorrect && correctChoice && (
                  <div style={{ fontSize: 13, color: SUCCESS, marginTop: 4 }}>Correct: {correctChoice.label}. {correctChoice.text}</div>
                )}
                {correctChoice?.justification && (
                  <div style={{ fontSize: 12, color: MUTED, marginTop: 8, lineHeight: 1.5 }}>
                    <span style={{ color: TEXT }}>Explanation:</span> {correctChoice.justification}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Active / Checked ─────────────────────────────────────────────────────
  const isChecked = phase === "checked";

  return (
    <div style={pageStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Practice Set {setNumber}</h1>
        <button onClick={() => navigate("/practice")} style={{ background: "none", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "6px 14px", color: TEXT, cursor: "pointer", fontSize: 13 }}>Exit</button>
      </div>

      <div style={{ fontSize: 12, color: MUTED, marginBottom: 6 }}>Question {index + 1} of {questions.length}</div>
      <div style={{ width: "100%", height: 6, borderRadius: 999, background: "rgba(255,255,255,0.08)", marginBottom: 20, overflow: "hidden" }}>
        <div ref={progressFillRef} style={{ height: "100%", background: ACCENT, borderRadius: 999, width: "0%", transition: "width 0.2s" }} />
      </div>

      <div style={{ background: CARD, borderRadius: 12, padding: 24, marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: MUTED, marginBottom: 8 }}>{currentQuestion.domain} · {currentQuestion.category}</div>
        <div style={{ fontSize: 17, fontWeight: 500, lineHeight: 1.6, marginBottom: 20 }}>
          {renderQuestionText(currentQuestion.text, TEXT)}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {currentQuestion.choices.map((choice) => {
            const isSelected = selectedChoiceId === choice.id;
            const isCorrectChoice = choice.isCorrect;

            let bg = "rgba(255,255,255,0.04)";
            let border = BORDER;
            let color = TEXT;

            if (isChecked) {
              if (isCorrectChoice) { bg = "rgba(74,222,128,0.12)"; border = SUCCESS; }
              else if (isSelected) { bg = "rgba(248,113,113,0.12)"; border = DANGER; }
              else { color = MUTED; }
            } else if (isSelected) {
              bg = "rgba(59,130,246,0.15)";
              border = ACCENT;
            }

            const hasJustification = isChecked && choice.justification;

            const choiceTag = isChecked && isSelected && isCorrectChoice
              ? <span style={{ color: SUCCESS, fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>✓ Your answer is correct</span>
              : isChecked && isSelected && !isCorrectChoice
              ? <span style={{ color: DANGER, fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>✗ Your answer is incorrect</span>
              : isChecked && !isSelected && isCorrectChoice
              ? <span style={{ color: SUCCESS, fontWeight: 700 }}>✓</span>
              : null;

            return (
              <div key={choice.id} style={{ display: "flex", flexDirection: "column" }}>
                <div
                  onClick={() => handleSelect(choice.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "14px 16px",
                    borderRadius: hasJustification ? "8px 8px 0 0" : 8,
                    border: `1px solid ${border}`,
                    background: bg, color,
                    cursor: isChecked ? "default" : "pointer",
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
                    fontSize: 12,
                    color: MUTED,
                    lineHeight: 1.5,
                  }}>
                    <span style={{ color: TEXT }}>Explanation:</span> {choice.justification}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {!isChecked ? (
          <button onClick={handleSkip} style={{ background: "none", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "10px 20px", fontSize: 13, color: MUTED, cursor: "pointer" }}>
            Skip question
          </button>
        ) : <div />}

        {!isChecked ? (
          <button
            disabled={!selectedChoiceId}
            onClick={handleCheck}
            style={{
              background: selectedChoiceId ? ACCENT : "rgba(255,255,255,0.08)",
              border: "none", borderRadius: 8, padding: "10px 28px",
              fontSize: 14, fontWeight: 600,
              color: selectedChoiceId ? "#fff" : MUTED,
              cursor: selectedChoiceId ? "pointer" : "not-allowed",
            }}
          >
            Check
          </button>
        ) : (
          <button onClick={handleNext} style={{ background: ACCENT, border: "none", borderRadius: 8, padding: "10px 28px", fontSize: 14, fontWeight: 600, color: "#fff", cursor: "pointer" }}>
            {index + 1 < questions.length ? "Next Question" : "Finish"}
          </button>
        )}
      </div>
    </div>
  );
}
