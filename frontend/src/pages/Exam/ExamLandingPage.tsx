import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://127.0.0.1:4000";

interface AttemptSummary {
  id: string;
  score: number | null;
  total: number | null;
  percent: number | null;
  submittedAt: string | null;
}

export default function ExamLandingPage() {
  const navigate = useNavigate();
  const [lastAttempt, setLastAttempt] = useState<AttemptSummary | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/attempts?mode=EXAM`)
      .then((r) => r.json())
      .then((data: AttemptSummary[]) => {
        if (data.length > 0) setLastAttempt(data[0]);
      })
      .catch(() => {});
  }, []);

  const startExamSet = (slot: number) => {
    navigate("/exam/intro", {
      state: {
        mode: "full",
        domains: [1, 2, 3, 4, 5],
        count: 150,
        minutes: 240,
        mock: slot,
      },
    });
  };

  return (
    <div style={{ padding: 32, maxWidth: 720, margin: "0 auto", color: "var(--text)" }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, margin: "0 0 6px 0" }}>Exam</h1>
      <p style={{ color: "var(--muted)", fontSize: 13, margin: "0 0 24px 0" }}>
        Simulate the real CISA exam — 150 questions · 4 hours · domain-weighted · timed
      </p>

      {lastAttempt && (
        <div style={{
          background: "var(--card-bg)",
          border: "1px solid var(--card-border)",
          borderRadius: 12,
          padding: "16px 20px",
          marginBottom: 20,
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>
            Last Attempt
          </div>
          <div style={{ fontSize: 28, fontWeight: 900, color: "var(--text)" }}>
            {lastAttempt.percent ?? 0}%
          </div>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>
            {lastAttempt.score} / {lastAttempt.total} correct ·{" "}
            {lastAttempt.submittedAt ? new Date(lastAttempt.submittedAt).toLocaleDateString() : ""}
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
        <button
          onClick={() => navigate("/exam/setup")}
          style={{ background: "var(--accent)", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
        >
          Custom Quiz
        </button>
        <button
          onClick={() => navigate("/exam/history")}
          style={{ background: "transparent", color: "var(--accent)", border: "1px solid var(--accent)", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
        >
          View History
        </button>
      </div>

      <h2 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 12px 0", color: "var(--text)" }}>
        Exam Sets
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => startExamSet(n)}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "var(--card-bg)",
              border: "1px solid var(--card-border)",
              borderRadius: 10,
              padding: "14px 18px",
              cursor: "pointer",
              color: "var(--text)",
              textAlign: "left",
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>Exam Set {n}</div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
                150 questions · 4 hours · CISA weighted · timed
              </div>
            </div>
            <span style={{ fontSize: 18, color: "var(--muted)" }}>›</span>
          </button>
        ))}
      </div>
    </div>
  );
}
