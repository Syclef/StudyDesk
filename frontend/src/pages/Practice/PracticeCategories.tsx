import { useNavigate } from "react-router-dom";

const SETS = [1, 2, 3, 4, 5];

export default function PracticeCategories() {
  const navigate = useNavigate();

  return (
    <div style={{
      padding: "32px",
      maxWidth: 720,
      margin: "0 auto",
      color: "var(--text)",
    }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, margin: "0 0 6px 0" }}>Practice</h1>
      <p style={{ color: "var(--muted)", fontSize: 13, margin: "0 0 28px 0" }}>
        150 questions · CISA domain-weighted · randomized · check answer after each question
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {SETS.map((n) => (
          <div
            key={n}
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--card-border)",
              borderRadius: 12,
              padding: "18px 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>Practice Set {n}</div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 3 }}>
                150 questions · All 5 domains · No timer
              </div>
            </div>
            <button
              onClick={() => navigate(`/practice/session/${n}`)}
              style={{
                background: "var(--accent)",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "8px 20px",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Start
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
