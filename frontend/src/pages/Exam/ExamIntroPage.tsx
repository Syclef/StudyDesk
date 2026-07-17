import { useLocation, useNavigate } from "react-router-dom";

type LocationState = {
  mode?: "full" | "domain" | "custom";
  domains?: number[];
  count?: number;
  minutes?: number;
  mock?: number;
};

export default function ExamIntroPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state || {}) as LocationState;
  const setNumber = state.mock ?? null;

  const startExam = () => {
    navigate("/exam/take", { state });
  };

  return (
    <div style={{ padding: 32, maxWidth: 720, margin: "0 auto", color: "var(--text)" }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, margin: "0 0 4px 0" }}>
        {setNumber ? `Exam Set ${setNumber}` : "Custom Quiz"}
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 13, margin: "0 0 28px 0" }}>
        ISACA CISA® Examination Simulator
      </p>

      {/* Exam details */}
      <div style={{
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
        borderRadius: 12,
        padding: "20px 24px",
        marginBottom: 20,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 16,
      }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Questions</div>
          <div style={{ fontSize: 22, fontWeight: 900 }}>150</div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Time Limit</div>
          <div style={{ fontSize: 22, fontWeight: 900 }}>4 hours</div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Passing Score</div>
          <div style={{ fontSize: 22, fontWeight: 900 }}>75%</div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Domains</div>
          <div style={{ fontSize: 22, fontWeight: 900 }}>All 5</div>
        </div>
      </div>

      {/* Instructions */}
      <div style={{
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
        borderRadius: 12,
        padding: "20px 24px",
        marginBottom: 28,
      }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 14px 0" }}>Instructions</h2>
        <ul style={{ margin: 0, padding: "0 0 0 18px", display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            "This exam contains 150 questions weighted across all 5 CISA domains.",
            "You have 4 hours to complete the exam. The timer starts when you click Start.",
            "You can navigate between questions using the ‹ and › buttons or the question grid.",
            "Flag questions for review using the ⚑ button.",
            "Answers are not revealed until after you submit.",
            "The exam will auto-submit when time runs out.",
            "A score of 75% or higher is required to pass.",
          ].map((item, i) => (
            <li key={i} style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.5 }}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Domain weights */}
      <div style={{
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
        borderRadius: 12,
        padding: "20px 24px",
        marginBottom: 28,
      }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 14px 0" }}>Domain Weights</h2>
        {[
          { domain: "D1 — Information System Auditing Process", pct: 21 },
          { domain: "D2 — Governance and Management of IT", pct: 17 },
          { domain: "D3 — IS Acquisition, Development and Implementation", pct: 12 },
          { domain: "D4 — IS Operations and Business Resilience", pct: 23 },
          { domain: "D5 — Protection of Information Assets", pct: 27 },
        ].map((d) => (
          <div key={d.domain} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
              <span style={{ color: "var(--text)" }}>{d.domain}</span>
              <span style={{ fontWeight: 700, color: "var(--accent)" }}>{d.pct}%</span>
            </div>
            <div style={{ height: 4, borderRadius: 999, background: "var(--border)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${d.pct}%`, background: "var(--accent)", borderRadius: 999 }} />
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 12 }}>
        <button
          onClick={startExam}
          style={{
            background: "var(--accent)",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            padding: "14px 32px",
            fontSize: 15,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Start Exam
        </button>
        <button
          onClick={() => navigate("/exam")}
          style={{
            background: "transparent",
            color: "var(--muted)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            padding: "14px 24px",
            fontSize: 15,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
