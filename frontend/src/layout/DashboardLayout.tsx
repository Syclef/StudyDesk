import { Outlet, useLocation, useNavigate } from "react-router-dom";

// No sidebar anymore — every page under this layout gets a single small
// "back to Dashboard" link instead, since there are far more pages here
// (Study, Practice, Exam + its sub-pages, Flashcards, Resources, Games +
// its sub-pages) than can be safely hand-edited one by one. Hidden on the
// Dashboard itself, since "back to Dashboard" makes no sense while already
// there.
const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname === "/";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {!isDashboard && (
        <button
          onClick={() => navigate("/")}
          style={{
            position: "fixed", top: 16, left: 16, zIndex: 500,
            display: "flex", alignItems: "center", gap: 6,
            background: "var(--card-bg, #fff)", border: "1px solid var(--card-border, rgba(0,0,0,0.08))",
            borderRadius: 999, padding: "8px 16px", fontSize: 13, fontWeight: 600,
            color: "var(--text, #1d1d1f)", cursor: "pointer", boxShadow: "var(--shadow-sm)",
          }}
        >
          ← Dashboard
        </button>
      )}
      <main style={{ background: "var(--bg)" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
