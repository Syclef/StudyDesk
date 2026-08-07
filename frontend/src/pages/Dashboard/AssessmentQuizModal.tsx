import React, { useState } from "react";

const API_BASE = "http://127.0.0.1:4000";
const DOMAIN_CODES = ["D1", "D2", "D3", "D4", "D5"];
const PER_DOMAIN = 5;
const SEEN_KEY = "studydesk_assessment_seen_questions_v1";

function getSeenIds(): Set<string> {
  try {
    const raw = localStorage.getItem(SEEN_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function addSeenIds(ids: string[]) {
  const seen = getSeenIds();
  ids.forEach((id) => seen.add(id));
  localStorage.setItem(SEEN_KEY, JSON.stringify([...seen]));
}

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

export interface AssessmentPerDomain {
  correct: number;
  total: number;
}

interface Props {
  onComplete: (perDomain: Record<string, AssessmentPerDomain>) => void;
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

const DOMAIN_NAMES: Record<string, string> = {
  D1: "Information System Auditing Process",
  D2: "Governance and Management of IT",
  D3: "Information Systems Acquisition, Development, and Implementation",
  D4: "Information Systems Operations and Business Resilience",
  D5: "Protection of Information Assets",
};

export default function AssessmentQuizModal({ onComplete, onClose }: Props) {
  const [phase, setPhase] = useState<"intro" | "quiz" | "results">("intro");
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [index, setIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState<Record<string, AssessmentPerDomain>>({});
  const [error, setError] = useState(false);

  const startQuiz = () => {
    setPhase("quiz");
    Promise.all(DOMAIN_CODES.map((d) => fetch(`${API_BASE}/questions?domain=${d}`).then((r) => (r.ok ? r.json() : Promise.reject()))))
      .then((allByDomain: Question[][]) => {
        const seen = getSeenIds();
        const picked = allByDomain.flatMap((qs) => {
          const unseen = qs.filter((q) => !seen.has(q.id));
          // If not enough unseen questions remain in this domain (small pool,
          // or you've genuinely seen most of it before), fall back to the full
          // pool rather than showing fewer than PER_DOMAIN questions.
          const pool = unseen.length >= Math.min(PER_DOMAIN, qs.length) ? unseen : qs;
          return shuffle(pool).slice(0, Math.min(PER_DOMAIN, pool.length));
        });
        if (picked.length === 0) throw new Error();
        const finalOrder = shuffle(picked);
        setQuestions(finalOrder);
        addSeenIds(finalOrder.map((q) => q.id));
        const init: Record<string, AssessmentPerDomain> = {};
        DOMAIN_CODES.forEach((d) => { init[d] = { correct: 0, total: 0 }; });
        setResults(init);
      })
      .catch(() => setError(true));
  };

  const current = questions?.[index];

  const handleSelect = (choiceId: string) => {
    if (checked) return;
    setSelectedId(choiceId);
  };

  const handleCheck = () => {
    if (!current || !selectedId) return;
    setChecked(true);
    const choice = current.choices.find((c) => c.id === selectedId);
    setResults((prev) => ({
      ...prev,
      [current.domain]: {
        correct: prev[current.domain].correct + (choice?.isCorrect ? 1 : 0),
        total: prev[current.domain].total + 1,
      },
    }));
  };

  const handleNext = () => {
    if (!questions) return;
    if (index + 1 < questions.length) {
      setIndex(index + 1);
      setSelectedId(null);
      setChecked(false);
    } else {
      setPhase("results");
    }
  };

  const handleFinish = () => {
    onComplete(results);
  };

  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <div style={{ fontSize: 19, fontWeight: 700 }}>Study Plan Assessment</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--muted)", fontSize: 24, cursor: "pointer", lineHeight: 1 }}>×</button>
        </div>

        {phase === "intro" ? (
          <div>
            <div style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.7, margin: "18px 0" }}>
              <strong>What this is:</strong> a 25-question check (5 per domain, evenly split across all
              five CISA domains) to get a quick read on where you stand right now.
            </div>
            <div style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.7, margin: "0 0 16px 0" }}>
              <strong>Why it matters:</strong> your results feed straight into Current Study Plan, which
              shows every domain you're under 75% on — ranked by official CISA exam weight, so the
              highest-stakes weak domain always shows up first.
            </div>
            <div style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.7, margin: "0 0 28px 0" }}>
              <strong>What you'll get:</strong> a per-domain score breakdown so you can see exactly where
              you stand. It's one-time, so you won't be asked again once it's done.
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button onClick={startQuiz}
                style={{ background: "var(--accent)", color: "#fff", border: "none", borderRadius: 10, padding: "12px 28px", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
                Start Assessment
              </button>
            </div>
          </div>
        ) : error ? (
          <div style={{ padding: "40px 0", color: "var(--muted)", fontSize: 14, textAlign: "center" }}>
            Couldn't load the assessment. Try again in a bit.
          </div>
        ) : !questions ? (
          <div style={{ padding: "40px 0", color: "var(--muted)", fontSize: 14, textAlign: "center" }}>Loading…</div>
        ) : phase === "quiz" && current ? (
          <div>
            <div style={{ fontSize: 13, color: "var(--muted)", margin: "14px 0 18px 0" }}>
              Question {index + 1} of {questions.length} · one-time — this won't affect your Progress or Domain Breakdown
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
        ) : phase === "results" ? (
          <div>
            {(() => {
              const totalCorrect = Object.values(results).reduce((s, d) => s + d.correct, 0);
              const totalQuestions = Object.values(results).reduce((s, d) => s + d.total, 0);
              const overallPct = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
              return (
                <>
                  <div style={{ fontSize: 15, color: "var(--muted)", margin: "14px 0 4px 0" }}>
                    You scored
                  </div>
                  <div style={{ fontSize: 40, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>
                    {totalCorrect} / {totalQuestions} <span style={{ fontSize: 22, color: "var(--muted)", fontWeight: 500 }}>({overallPct}%)</span>
                  </div>
                  <div style={{ marginBottom: 24 }} />

                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 10 }}>
                    By domain
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}>
                    {DOMAIN_CODES.map((d) => {
                      const r = results[d];
                      const pct = r && r.total > 0 ? Math.round((r.correct / r.total) * 100) : null;
                      const barColor = pct === null ? "var(--muted)" : pct >= 75 ? "var(--success,#34c759)" : pct >= 50 ? "var(--warning,#ff9500)" : "var(--danger,#ff3b30)";
                      return (
                        <div key={d} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ width: 220, fontSize: 13, color: "var(--text)", flexShrink: 0 }}>{DOMAIN_NAMES[d] ?? d}</div>
                          <div style={{ flex: 1, height: 8, borderRadius: 999, background: "var(--panel-2, rgba(128,128,128,0.15))", overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${pct ?? 0}%`, background: barColor, borderRadius: 999 }} />
                          </div>
                          <div style={{ width: 70, fontSize: 13, color: "var(--muted)", textAlign: "right", flexShrink: 0 }}>
                            {r ? `${r.correct}/${r.total}` : "—"}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {(() => {
                    const weakDomains = DOMAIN_CODES.filter((d) => {
                      const r = results[d];
                      return r && r.total > 0 && Math.round((r.correct / r.total) * 100) < 75;
                    });
                    return (
                      <div style={{
                        background: "var(--panel-2, rgba(128,128,128,0.08))", borderRadius: 12, padding: "16px 20px", marginBottom: 24,
                      }}>
                        <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 6 }}>Based on these results</div>
                        <div style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.5 }}>
                          {weakDomains.length > 0
                            ? <>Current Study Plan will show <strong>{weakDomains.map((d) => DOMAIN_NAMES[d] ?? d).join(", ")}</strong> as weak — ranked by exam weight, heaviest first.</>
                            : "You're at 75% or higher across every domain — Current Study Plan won't have anything to flag as weak from this."}
                        </div>
                      </div>
                    );
                  })()}

                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button onClick={handleFinish}
                      style={{ background: "var(--accent)", color: "#fff", border: "none", borderRadius: 10, padding: "12px 28px", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
                      Continue to Dashboard
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        ) : null}
      </div>
    </div>
  );
}
