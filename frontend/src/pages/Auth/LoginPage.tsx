import { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";
import { useTheme } from "../../utils/theme";

const PALETTES = {
  dark: {
    BG: "#0f1b2d",
    CARD: "#1a2540",
    TEXT: "#e5eaf1",
    MUTED: "#94a3b8",
    BORDER: "rgba(255,255,255,0.10)",
    ACCENT: "#3b82f6",
    DANGER: "#f87171",
    ON_ACCENT: "#fff",
    INPUT_BG: "rgba(255,255,255,0.04)",
  },
  light: {
    BG: "#f8fafc",
    CARD: "#ffffff",
    TEXT: "#1e293b",
    MUTED: "#64748b",
    BORDER: "rgba(15,23,42,0.12)",
    ACCENT: "#2563eb",
    DANGER: "#dc2626",
    ON_ACCENT: "#fff",
    INPUT_BG: "rgba(15,23,42,0.03)",
  },
} as const;

export default function LoginPage() {
  const { mode } = useTheme();
  const { BG, CARD, TEXT, MUTED, BORDER, ACCENT, DANGER, ON_ACCENT, INPUT_BG } = PALETTES[mode];
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: string } };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // If there's already a valid session (e.g. navigated here directly, or
  // via the back button, while logged in), don't show the login form at
  // all — send them straight back to where they'd actually want to be.
  if (!loading && user) {
    return <Navigate to={location.state?.from ?? "/"} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const result = await login(email.trim(), password);
    setSubmitting(false);
    if (result.ok) {
      navigate(location.state?.from ?? "/", { replace: true });
    } else {
      setError(result.error);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <form
        onSubmit={handleSubmit}
        style={{
          background: CARD,
          border: `1px solid ${BORDER}`,
          borderRadius: 16,
          padding: "40px 36px",
          width: "100%",
          maxWidth: 380,
          boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
        }}
      >
        <div style={{ fontSize: 22, fontWeight: 700, color: TEXT, marginBottom: 4, textAlign: "center" }}>
          StudyDesk
        </div>
        <div style={{ fontSize: 13, color: MUTED, marginBottom: 28, textAlign: "center" }}>
          Sign in to continue
        </div>

        <label style={{ display: "block", fontSize: 13, color: MUTED, marginBottom: 6 }}>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus
          style={{
            width: "100%", boxSizing: "border-box", background: INPUT_BG, border: `1px solid ${BORDER}`,
            borderRadius: 8, padding: "10px 12px", fontSize: 14, color: TEXT, marginBottom: 18, outline: "none",
          }}
        />

        <label style={{ display: "block", fontSize: 13, color: MUTED, marginBottom: 6 }}>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: "100%", boxSizing: "border-box", background: INPUT_BG, border: `1px solid ${BORDER}`,
            borderRadius: 8, padding: "10px 12px", fontSize: 14, color: TEXT, marginBottom: error ? 12 : 24, outline: "none",
          }}
        />

        {error && (
          <div style={{ fontSize: 13, color: DANGER, marginBottom: 16 }}>{error}</div>
        )}

        <button
          type="submit"
          disabled={submitting}
          style={{
            width: "100%", background: ACCENT, color: ON_ACCENT, border: "none", borderRadius: 8,
            padding: "12px", fontSize: 14, fontWeight: 600, cursor: submitting ? "default" : "pointer",
            opacity: submitting ? 0.7 : 1,
          }}
        >
          {submitting ? "Signing in…" : "Sign In"}
        </button>

        <div style={{ fontSize: 12, color: MUTED, marginTop: 20, textAlign: "center", lineHeight: 1.5 }}>
          Accounts are set up individually — if you don't have one yet,
          ask whoever's administering StudyDesk for your group.
        </div>
      </form>
    </div>
  );
}
