import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Brief moment while /auth/me resolves on first load — avoids a flash
    // of the login page for someone who's actually already logged in.
    return null;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}
