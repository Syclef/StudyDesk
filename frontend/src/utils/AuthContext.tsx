import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { registerUnauthorizedHandler } from "./apiFetch";

const API_BASE = "http://localhost:4000";

export interface AuthUser {
  id: string;
  email: string;
  displayName: string | null;
  hasCompletedAssessment: boolean;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, { credentials: "include" });
      if (res.ok) {
        setUser(await res.json());
      } else if (res.status === 401) {
        // Session is actually invalid/expired — genuinely logged out.
        setUser(null);
      }
      // Any other failure (429 rate-limited, 500, network hiccup) is not
      // proof the session is invalid — leave the current `user` state as
      // it was rather than falsely logging someone out because of an
      // unrelated server hiccup. Rapid back/forward navigation (each
      // triggering a full reload + a burst of re-fetches) can plausibly
      // hit the rate limiter; that's a reason to back off, not a reason
      // to force a real re-login.
    } catch {
      // Network failure — same reasoning: don't assume logged-out.
    }
  };

  useEffect(() => {
    // If any API call anywhere in the app gets a 401 (session expired,
    // cookie cleared, etc.), fall back to logged-out state immediately
    // rather than leaving stale user data showing.
    registerUnauthorizedHandler(() => setUser(null));

    refreshUser().finally(() => setLoading(false));

    // Browser back/forward can restore a page from bfcache — a frozen
    // snapshot of the ENTIRE page (DOM + running JS state), served
    // instantly without re-running any code, including this effect.
    // That's a real security problem, not just a UX quirk: if someone
    // logs out and then presses back, a bfcache restore could show the
    // last-rendered authenticated page exactly as it looked, without ever
    // re-checking whether the session is still valid.
    //
    // A soft fix (just re-fetching /auth/me in the background) isn't
    // reliable enough here — it still lets the stale cached page render
    // first, however briefly, before state catches up. The correct fix
    // is to never let that cached page be shown at all: force a full hard
    // reload on any bfcache restore. A real reload re-runs everything
    // from scratch against the actual current server session state, with
    // zero cached JS/DOM state involved — there's nothing stale left to
    // accidentally expose.
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        window.location.reload();
      }
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        return { ok: false as const, error: body.message ?? "Invalid email or password" };
      }
      setUser(await res.json());
      return { ok: true as const };
    } catch {
      return { ok: false as const, error: "Could not reach the server. Is the API running?" };
    }
  };

  const logout = async () => {
    await fetch(`${API_BASE}/auth/logout`, { method: "POST", credentials: "include" }).catch(() => {});
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
