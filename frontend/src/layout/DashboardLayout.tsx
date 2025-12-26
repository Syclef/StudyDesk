import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import RouteTransition from "../components/RouteTransition";

const DashboardLayout = () => {
  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 bg-gray-100 min-h-screen p-6 relative">
        <RouteTransition />
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
