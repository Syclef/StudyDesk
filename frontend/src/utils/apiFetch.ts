// installAuthFetch: patches the global window.fetch so every existing fetch()
// call in the app — all 15+ call sites, each with its own hardcoded API_BASE
// constant — automatically gets what it needs for auth, without editing
// every one of them individually:
//
//   1. `credentials: "include"` — without this, the browser won't send the
//      httpOnly session cookie set by /auth/login, and every request will
//      look logged-out even right after a successful login.
//   2. A shared 401 handler — if a session expires or was never valid, every
//      caller shouldn't need its own "if 401, redirect to login" logic.
//
// This is safe here specifically because every fetch() call in this codebase
// targets this app's own API (verified: no third-party fetch calls exist) —
// patching global fetch is not something to do lightly in general, but
// there's nothing else it could affect in this app.
//
// Call this once, before the app renders (see main.tsx).

type Unauthorized401Handler = () => void;
let onUnauthorized: Unauthorized401Handler | null = null;

export function registerUnauthorizedHandler(handler: Unauthorized401Handler) {
  onUnauthorized = handler;
}

let installed = false;

export function installAuthFetch() {
  if (installed) return;
  installed = true;

  const originalFetch = window.fetch.bind(window);

  window.fetch = async (input: RequestInfo | URL, init: RequestInit = {}) => {
    const res = await originalFetch(input, {
      ...init,
      credentials: "include",
    });

    if (res.status === 401 && onUnauthorized) {
      onUnauthorized();
    }

    return res;
  };
}
