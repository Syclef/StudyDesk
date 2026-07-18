import { useNavigate } from "react-router-dom";

export default function PracticeCategories() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 32, maxWidth: 860, margin: "0 auto", color: "var(--text)" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px 0", letterSpacing: "-0.3px" }}>Practice</h1>
      <p style={{ color: "var(--muted)", fontSize: 13, margin: "0 0 24px 0" }}>
        150 questions · CISA domain-weighted · randomized · check answer after each question
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {[1, 2, 3, 4, 5].map((n) => (
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
            </div>
            <button
              onClick={() => navigate(`/practice/session/${n}`)}
              style={{
                background: "var(--accent)", color: "#fff", border: "none",
                borderRadius: 8, padding: "7px 18px",
                fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}
            >Start</button>
          </div>
        ))}
      </div>
    </div>
  );
}
