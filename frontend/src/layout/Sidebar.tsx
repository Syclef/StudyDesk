import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Target,
  GraduationCap,
  Layers,
  Gamepad2,
} from "lucide-react";

export default function Sidebar() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${
      isActive
        ? "bg-blue-600/90 text-white shadow-md shadow-blue-900/30"
        : "text-slate-300/80 hover:bg-white/5 hover:text-white"
    }`;

  const iconClass = "w-5 h-5";

  return (
    <aside className="sidebar-container sidebar-float w-64 p-6 flex flex-col rounded-[28px] self-stretch">
      {/* App Logo/Title */}
      <div className="mb-10 px-2">
        <h1 className="text-xl font-bold text-white tracking-tight">
          AuditStudyDesk<span className="text-blue-500">.</span>
        </h1>
      </div>

      <nav className="space-y-8">
        {/* MAIN SECTION */}
        <div>
          <p className="text-[10px] font-bold text-slate-400/60 tracking-[0.22em] mb-4 px-2">
            MAIN
          </p>
          <div className="space-y-1">
            <NavLink to="/" className={linkClass}>
              <LayoutDashboard className={iconClass} />
              <span className="font-semibold">Dashboard</span>
            </NavLink>

            <NavLink to="/study" className={linkClass}>
              <BookOpen className={iconClass} />
              <span className="font-semibold">Study</span>
            </NavLink>

            <NavLink to="/practice" className={linkClass}>
              <Target className={iconClass} />
              <span className="font-semibold">Practice</span>
            </NavLink>

            <NavLink to="/exam" className={linkClass}>
              <GraduationCap className={iconClass} />
              <span className="font-semibold">Exam</span>
            </NavLink>
          </div>
        </div>

        {/* RESOURCES SECTION */}
        <div>
          <p className="text-[10px] font-bold text-slate-400/60 tracking-[0.22em] mb-4 px-2">
            RESOURCES
          </p>
          <div className="space-y-1">
            <NavLink to="/flashcards" className={linkClass}>
              <Layers className={iconClass} />
              <span className="font-semibold">Flashcards</span>
            </NavLink>

            <NavLink to="/games" className={linkClass}>
              <Gamepad2 className={iconClass} />
              <span className="font-semibold">Game Center</span>
            </NavLink>
          </div>
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="mt-auto pt-6 border-t border-white/10">
        <div className="px-2 flex items-center gap-3 text-slate-300/80">
          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-blue-300">
            JD
          </div>
          <span className="text-sm font-semibold">User Settings</span>
        </div>
      </div>
    </aside>
  );
}
