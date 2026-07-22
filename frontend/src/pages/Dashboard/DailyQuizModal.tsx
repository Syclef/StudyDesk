import React, { useEffect, useState } from "react";

const API_BASE = "http://127.0.0.1:4000";
const QUESTION_COUNT = 10;

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

interface Props {
  domain: string;
  domainName: string;
  onComplete: (correct: number, total: number) => void;
  onClose: () => void;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const overlay: React.CSSProperties = {
  position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
  display: "flex", alignItems: "center", justifyContent: "center",
  zIndex: 1000, padding: 20,
};

const modal: React.CSSProperties = {
  background: "var(--card-bg)", border: "1px solid var(--card-border)",
  borderRadius: 18, boxShadow: "var(--shadow)",
  width: "100%", maxWidth: 720, maxHeight: "88vh", overflowY: "auto",
  padding: 36, color: "var(--text)",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
};

export default function DailyQuizModal({ domain, domainName, onComplete, onClose }: Props) {
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [index, setIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/questions?domain=${domain}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: Question[]) => {
        if (!Array.isArray(data) || data.length === 0) throw new Error();
        setQuestions(shuffle(data).slice(0, Math.min(QUESTION_COUNT, data.length)));
      })
      .catch(() => setError(true));
  }, [domain]);

  const current = questions?.[index];

  const handleSelect = (choiceId: string) => {
    if (checked) return;
    setSelectedId(choiceId);
  };

  const handleCheck = () => {
    if (!current || !selectedId) return;
    setChecked(true);
    const choice = current.choices.find((c) => c.id === selectedId);
    if (choice?.isCorrect) setCorrectCount((c) => c + 1);
  };

  const handleNext = () => {
    if (!questions) return;
    if (index + 1 < questions.length) {
      setIndex(index + 1);
      setSelectedId(null);
      setChecked(false);
    } else {
      onComplete(correctCount, questions.length);
    }
  };

  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <div style={{ fontSize: 19, fontWeight: 700 }}>Daily Quiz — {domainName}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--muted)", fontSize: 24, cursor: "pointer", lineHeight: 1 }}>×</button>
        </div>

        {error ? (
          <div style={{ padding: "40px 0", color: "var(--muted)", fontSize: 14, textAlign: "center" }}>
            Couldn't load today's questions. Try again in a bit.
          </div>
        ) : !questions ? (
          <div style={{ padding: "40px 0", color: "var(--muted)", fontSize: 14, textAlign: "center" }}>Loading…</div>
        ) : current ? (
          <div>
            <div style={{ fontSize: 13, color: "var(--muted)", margin: "14px 0 18px 0" }}>
              Question {index + 1} of {questions.length}
            </div>
            <div style={{ fontSize: 18, color: "var(--text)", marginBottom: 24, lineHeight: 1.6, fontWeight: 500 }}>{current.text}</div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {current.choices.map((c) => {
                const isSelected = selectedId === c.id;
                let borderColor = "var(--card-border)";
                let bg = "var(--panel-2, var(--card-bg))";
                if (checked) {
                  if (c.isCorrect) { borderColor = "var(--success,#34c759)"; bg = "var(--success-bg, rgba(52,199,89,0.08))"; }
                  else if (isSelected) { borderColor = "var(--danger,#ff3b30)"; bg = "var(--danger-bg, rgba(255,59,48,0.08))"; }
                } else if (isSelected) {
                  borderColor = "var(--accent)";
                }
                return (
                  <button
                    key={c.id}
                    onClick={() => handleSelect(c.id)}
                    disabled={checked}
                    style={{
                      textAlign: "left", padding: "16px 20px", borderRadius: 12,
                      border: `2px solid ${borderColor}`, background: bg,
                      color: "var(--text)", fontSize: 16, lineHeight: 1.5, cursor: checked ? "default" : "pointer",
                    }}
                  >
                    <strong style={{ marginRight: 10 }}>{c.label}.</strong>{c.text}
                  </button>
                );
              })}
            </div>

            {checked && (
              <div style={{ marginTop: 16, fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
                {current.choices.find((c) => c.isCorrect)?.justification}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 28 }}>
              {!checked ? (
                <button onClick={handleCheck} disabled={!selectedId}
                  style={{ background: "var(--accent)", color: "#fff", border: "none", borderRadius: 10, padding: "12px 28px", fontSize: 15, fontWeight: 600, cursor: selectedId ? "pointer" : "default", opacity: selectedId ? 1 : 0.5 }}>
                  Check Answer
                </button>
              ) : (
                <button onClick={handleNext}
                  style={{ background: "var(--accent)", color: "#fff", border: "none", borderRadius: 10, padding: "12px 28px", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
                  {index + 1 < questions.length ? "Next" : "Finish"}
                </button>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
