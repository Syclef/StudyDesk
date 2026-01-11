import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import RouteTransition from "../components/RouteTransition";

const DashboardLayout = () => {
  return (
    <div className="app-shell flex min-h-screen w-full relative overflow-hidden bg-[url('/dashboard-bg.png')] bg-cover bg-center bg-no-repeat bg-fixed">
      {/* overlay glow (reference look) */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(at_50%_-20%,rgba(43,16,85,0.40)_0%,transparent_80%)]" />

      {/* sidebar sits on same background */}
      <Sidebar />

      {/* IMPORTANT:
          - no bg color
          - no padding (prevents "box inside website")
          - allow pages (Dashboard) to control spacing
      */}
      <main className="flex-1 min-h-screen relative z-10">
        <RouteTransition />
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
