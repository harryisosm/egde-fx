import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Redirects to /login if not authenticated (no user in localStorage).
 */
export function useAuthGuard() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
        navigate("/login", { replace: true });
    }
  }, [navigate]);
}
