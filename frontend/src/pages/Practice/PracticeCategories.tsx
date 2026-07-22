import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://127.0.0.1:4000";

interface AttemptSummary {
  id: string;
  mode: string;
  mockSlot: number | null;
  score: number | null;
  total: number | null;
  percent: number | null;
  startedAt: string;
  submittedAt: string | null;
}

export default function PracticeCategories() {
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState<AttemptSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/attempts?mode=PRACTICE`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data: AttemptSummary[]) => { setAttempts(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const statsForSet = (n: number) => {
    const setAttempts = attempts.filter((a) => a.mockSlot === n);
    return {
      count: setAttempts.length,
      last: setAttempts[0] ?? null, // already ordered submittedAt desc by the API
    };
  };

  const scoreColor = (pct: number | null) => {
    if (pct === null) return "var(--muted)";
    if (pct >= 75) return "var(--success)";
    if (pct >= 60) return "var(--warning)";
    return "var(--danger)";
  };

  return (
    <div style={{ padding: 32, maxWidth: 860, margin: "0 auto", color: "var(--text)" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px 0", letterSpacing: "-0.3px" }}>Practice</h1>
      <p style={{ color: "var(--muted)", fontSize: 13, margin: "0 0 24px 0" }}>
        150 questions · CISA domain-weighted · randomized · check answer after each question
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {[1, 2, 3, 4, 5].map((n) => {
          const { count, last } = statsForSet(n);
          return (
            <div key={n} style={{
              background: "var(--card-bg)",
              border: "1px solid var(--card-border)",
              borderRadius: 10,
              padding: "14px 18px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text)" }}>Practice Set {n}</div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
                  150 questions · All 5 domains · No timer
                </div>
                {!loading && (
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
                    {last ? (
                      <>
                        {count} session{count > 1 ? "s" : ""} · Last:{" "}
                        <span style={{ fontWeight: 600, color: scoreColor(last.percent) }}>{last.percent}%</span>
                        {" · "}{new Date(last.submittedAt!).toLocaleDateString()}
                      </>
                    ) : (
                      "Not attempted yet"
                    )}
                  </div>
                )}
              </div>
              <button
                onClick={() => navigate(`/practice/session/${n}`)}
                style={{
                  background: "var(--accent)", color: "#fff", border: "none",
                  borderRadius: 8, padding: "7px 18px",
                  fontSize: 13, fontWeight: 600, cursor: "pointer",
                }}
              >{last ? "Retry" : "Start"}</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
