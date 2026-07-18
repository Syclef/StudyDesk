import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, BookOpen, Target, GraduationCap,
  Layers, Sun, Moon,
} from "lucide-react";
import { useTheme } from "../utils/theme";

export default function Sidebar() {
  const { mode, toggle } = useTheme();

  return (
    <aside style={{
      width: 220, minWidth: 220, flexShrink: 0,
      height: "100vh", position: "sticky", top: 0,
      background: "var(--sidebar-bg, #ffffff)",
      borderRight: "1px solid var(--sidebar-border, rgba(0,0,0,0.08))",
      display: "flex", flexDirection: "column",
      padding: "16px 10px", overflowY: "auto",
    }}>
      <div style={{ padding: "4px 8px 20px", fontSize: 15, fontWeight: 700, color: "var(--text, #1d1d1f)", letterSpacing: "-0.3px" }}>
        AuditStudyDesk<span style={{ color: "var(--accent, #0071e3)" }}>.</span>
      </div>

      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        <p style={{ fontSize: 10, fontWeight: 600, color: "var(--muted, #6e6e73)", letterSpacing: "0.08em", textTransform: "uppercase", padding: "0 8px", margin: "0 0 4px 0" }}>Main</p>
        {[
          { to: "/", end: true, icon: <LayoutDashboard size={16} />, label: "Dashboard" },
          { to: "/study", icon: <BookOpen size={16} />, label: "Study" },
          { to: "/practice", icon: <Target size={16} />, label: "Practice" },
          { to: "/exam", icon: <GraduationCap size={16} />, label: "Exam" },
        ].map(({ to, end, icon, label }) => (
          <NavLink key={to} to={to} end={end}
            style={({ isActive }) => ({
              display: "flex", alignItems: "center", gap: 8,
              padding: "7px 8px", borderRadius: 8,
              fontSize: 13, fontWeight: isActive ? 600 : 500,
              color: isActive ? "var(--accent, #0071e3)" : "var(--text-2, #3d3d3f)",
              background: isActive ? "var(--accent-light, rgba(0,113,227,0.10))" : "transparent",
              textDecoration: "none",
            })}
          >
            {icon}<span>{label}</span>
          </NavLink>
        ))}

        <p style={{ fontSize: 10, fontWeight: 600, color: "var(--muted, #6e6e73)", letterSpacing: "0.08em", textTransform: "uppercase", padding: "0 8px", margin: "16px 0 4px 0" }}>Resources</p>
        <NavLink to="/flashcards"
          style={({ isActive }) => ({
            display: "flex", alignItems: "center", gap: 8,
            padding: "7px 8px", borderRadius: 8,
            fontSize: 13, fontWeight: isActive ? 600 : 500,
            color: isActive ? "var(--accent, #0071e3)" : "var(--text-2, #3d3d3f)",
            background: isActive ? "var(--accent-light, rgba(0,113,227,0.10))" : "transparent",
            textDecoration: "none",
          })}
        >
          <Layers size={16} /><span>Flashcards</span>
        </NavLink>
      </nav>

      <div style={{ borderTop: "1px solid var(--border, rgba(0,0,0,0.08))", paddingTop: 12, marginTop: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 4px" }}>
          <div style={{
            width: 28, height: 28, borderRadius: "50%",
            background: "var(--accent-light, rgba(0,113,227,0.10))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 700, color: "var(--accent, #0071e3)", flexShrink: 0,
          }}>JD</div>
          <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-2, #3d3d3f)", flex: 1 }}>User Settings</span>
          <button onClick={toggle}
            style={{
              width: 28, height: 28, borderRadius: 6,
              border: "1px solid var(--border, rgba(0,0,0,0.08))",
              background: "transparent", color: "var(--muted, #6e6e73)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", flexShrink: 0,
            }}
          >
            {mode === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>
      </div>
    </aside>
  );
}
