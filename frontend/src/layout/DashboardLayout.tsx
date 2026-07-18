import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const DashboardLayout = () => {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      <Sidebar />
      <main style={{ flex: 1, overflowY: "auto", background: "var(--bg)" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
