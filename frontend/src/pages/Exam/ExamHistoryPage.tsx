import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://127.0.0.1:4000";

interface AttemptSummary {
  id: string;
  mode: string;
  score: number | null;
  total: number | null;
  percent: number | null;
  startedAt: string;
  submittedAt: string | null;
}

export default function ExamHistoryPage() {
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState<AttemptSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/attempts`)
      .then((r) => r.json())
      .then((data: AttemptSummary[]) => {
        setAttempts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const scoreColor = (percent: number | null) => {
    if (percent === null) return "var(--muted)";
    if (percent >= 75) return "var(--success)";
    if (percent >= 60) return "var(--warning)";
    return "var(--danger)";
  };

  const scoreLabel = (percent: number | null) => {
    if (percent === null) return "—";
    if (percent >= 75) return "PASS";
    if (percent >= 60) return "BORDERLINE";
    return "FAIL";
  };

  return (
    <div style={{ padding: 32, maxWidth: 720, margin: "0 auto", color: "var(--text)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: "0 0 4px 0" }}>Exam History</h1>
          <p style={{ color: "var(--muted)", fontSize: 13, margin: 0 }}>
            {attempts.length} attempt{attempts.length !== 1 ? "s" : ""} recorded
          </p>
        </div>
        <button
          onClick={() => navigate("/exam")}
          style={{
            background: "transparent",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: "8px 16px",
            fontSize: 13,
            color: "var(--text)",
            cursor: "pointer",
          }}
        >
          ← Back
        </button>
      </div>

      {loading ? (
        <p style={{ color: "var(--muted)" }}>Loading...</p>
      ) : attempts.length === 0 ? (
        <div style={{
          background: "var(--card-bg)",
          border: "1px solid var(--card-border)",
          borderRadius: 12,
          padding: 32,
          textAlign: "center",
          color: "var(--muted)",
        }}>
          No exam attempts yet. Start a mock exam to see your history here.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {attempts.map((attempt, i) => (
            <div
              key={attempt.id}
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--card-border)",
                borderRadius: 12,
                padding: "16px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 16,
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>Attempt #{attempts.length - i}</span>
                  <span style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: 999,
                    background: `${scoreColor(attempt.percent)}20`,
                    color: scoreColor(attempt.percent),
                  }}>
                    {scoreLabel(attempt.percent)}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>
                  {attempt.score ?? "—"} / {attempt.total ?? "—"} correct ·{" "}
                  {attempt.mode} ·{" "}
                  {attempt.submittedAt
                    ? new Date(attempt.submittedAt).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })
                    : "In progress"}
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={{
                  fontSize: 28,
                  fontWeight: 900,
                  color: scoreColor(attempt.percent),
                }}>
                  {attempt.percent ?? "—"}%
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
