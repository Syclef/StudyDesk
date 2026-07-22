import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, BookOpen, Target, GraduationCap,
  Layers,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside style={{
      width: 240, minWidth: 240, flexShrink: 0,
      height: "100vh", position: "sticky", top: 0,
      background: "var(--sidebar-bg, #ffffff)",
      borderRight: "1px solid var(--sidebar-border, rgba(0,0,0,0.08))",
      display: "flex", flexDirection: "column",
      padding: "24px 14px", overflowY: "auto",
    }}>
      <div style={{ padding: "4px 10px 28px", fontSize: 18, fontWeight: 700, color: "var(--text, #1d1d1f)", letterSpacing: "-0.3px" }}>
        CISA Prep<span style={{ color: "var(--accent, #0071e3)" }}>.</span>
      </div>

      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: "var(--muted, #6e6e73)", letterSpacing: "0.08em", textTransform: "uppercase", padding: "0 10px", margin: "0 0 6px 0" }}>Main</p>
        {[
          { to: "/", end: true, icon: <LayoutDashboard size={18} />, label: "Dashboard" },
          { to: "/study", icon: <BookOpen size={18} />, label: "Study" },
          { to: "/practice", icon: <Target size={18} />, label: "Practice" },
          { to: "/exam", icon: <GraduationCap size={18} />, label: "Exam" },
        ].map(({ to, end, icon, label }) => (
          <NavLink key={to} to={to} end={end}
            style={({ isActive }) => ({
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 10px", borderRadius: 9,
              fontSize: 14, fontWeight: isActive ? 600 : 500,
              color: isActive ? "var(--accent, #0071e3)" : "var(--text-2, #3d3d3f)",
              background: isActive ? "var(--accent-light, rgba(0,113,227,0.10))" : "transparent",
              textDecoration: "none",
            })}
          >
            {icon}<span>{label}</span>
          </NavLink>
        ))}

        <p style={{ fontSize: 11, fontWeight: 600, color: "var(--muted, #6e6e73)", letterSpacing: "0.08em", textTransform: "uppercase", padding: "0 10px", margin: "22px 0 6px 0" }}>Resources</p>
        <NavLink to="/flashcards"
          style={({ isActive }) => ({
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 10px", borderRadius: 9,
            fontSize: 14, fontWeight: isActive ? 600 : 500,
            color: isActive ? "var(--accent, #0071e3)" : "var(--text-2, #3d3d3f)",
            background: isActive ? "var(--accent-light, rgba(0,113,227,0.10))" : "transparent",
            textDecoration: "none",
          })}
        >
          <Layers size={18} /><span>Flashcards</span>
        </NavLink>
      </nav>
    </aside>
  );
}
