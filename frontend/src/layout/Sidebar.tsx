import { NavLink } from "react-router-dom";

/**
 * Sidebar navigation for the entire app
 * - Visible on all pages
 * - Only main content changes via routing
 */
export default function Sidebar() {
  /**
   * Utility function to style active vs inactive links
   */
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-4 py-2 rounded transition ${
      isActive
        ? "bg-slate-700 text-white"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }`;

  return (
    <aside className="w-64 bg-slate-900 min-h-screen p-4">
      {/* App title */}
      <h1 className="text-xl font-bold text-white mb-6">
        Audit Study Desk
      </h1>

      {/* Navigation links */}
      <nav className="space-y-1">
        <NavLink to="/" className={linkClass}>
          Course Home
        </NavLink>

        <NavLink to="/study-plan" className={linkClass}>
          Study Plan
        </NavLink>

        <NavLink to="/practice" className={linkClass}>
          Practice
        </NavLink>

        <NavLink to="/tests" className={linkClass}>
          Tests
        </NavLink>

        <NavLink to="/flashcards" className={linkClass}>
          Flashcards
        </NavLink>

        <NavLink to="/game-center" className={linkClass}>
          Game Center
        </NavLink>

        <NavLink to="/resources" className={linkClass}>
          Resources
        </NavLink>
      </nav>
    </aside>
  );
}
