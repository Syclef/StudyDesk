import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";

// A real /logout route, not just an onClick handler — so typing /logout
// directly in the URL bar, bookmarking it, or navigating there via
// history doesn't just show a blank page (no matching route = React
// Router renders nothing). This performs the actual logout, then
// redirects to /login.
export default function LogoutPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout().then(() => navigate("/login", { replace: true }));
  }, []);

  return null;
}
