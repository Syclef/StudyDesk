import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  BookOpen, 
  Target, 
  GraduationCap, 
  Layers, 
  Gamepad2 
} from "lucide-react";

export default function Sidebar() {
  /**
   * Modern styling for NavLinks
   */
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group ${
      isActive
        ? "bg-blue-600 text-white shadow-md shadow-blue-900/20"
        : "text-slate-400 hover:bg-slate-800 hover:text-white"
    }`;

  const iconClass = "w-5 h-5";

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 min-h-screen p-6 flex flex-col">
      {/* App Logo/Title */}
      <div className="mb-10 px-2">
        <h1 className="text-xl font-bold text-white tracking-tight">
          AuditStudyDesk<span className="text-blue-500">.</span>
        </h1>
      </div>

      <nav className="space-y-8">
        {/* MAIN SECTION */}
        <div>
          <p className="text-[10px] font-bold text-slate-500 tracking-[0.2em] mb-4 px-2">
            MAIN
          </p>
          <div className="space-y-1">
            <NavLink to="/" className={linkClass}>
              <LayoutDashboard className={iconClass} />
              <span className="font-medium">Dashboard</span>
            </NavLink>

            <NavLink to="/study" className={linkClass}>
              <BookOpen className={iconClass} />
              <span className="font-medium">Study</span>
            </NavLink>

            <NavLink to="/practice" className={linkClass}>
              <Target className={iconClass} />
              <span className="font-medium">Practice</span>
            </NavLink>

            <NavLink to="/exam" className={linkClass}>
              <GraduationCap className={iconClass} />
              <span className="font-medium">Exam</span>
            </NavLink>
          </div>
        </div>

        {/* RESOURCES SECTION */}
        <div>
          <p className="text-[10px] font-bold text-slate-500 tracking-[0.2em] mb-4 px-2">
            RESOURCES
          </p>
          <div className="space-y-1">
            <NavLink to="/flashcards" className={linkClass}>
              <Layers className={iconClass} />
              <span className="font-medium">Flashcards</span>
            </NavLink>

            <NavLink to="/games" className={linkClass}>
              <Gamepad2 className={iconClass} />
              <span className="font-medium">Game Center</span>
            </NavLink>
          </div>
        </div>
      </nav>

      {/* Optional: User Profile / Bottom Section */}
      <div className="mt-auto pt-6 border-t border-slate-800">
        <div className="px-2 flex items-center gap-3 text-slate-400">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-blue-400">
            JD
          </div>
          <span className="text-sm font-medium">User Settings</span>
        </div>
      </div>
    </aside>
  );
}