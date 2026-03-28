import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type ThemeMode = "light" | "dark";

type ThemeContextValue = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "auditstudydesk_theme_v1";

function applyTheme(mode: ThemeMode) {
  document.documentElement.dataset.theme = mode;
}

export function ThemeProvider({ children, defaultMode = "dark" }: { children: React.ReactNode; defaultMode?: ThemeMode }) {
  const [mode, setModeState] = useState<ThemeMode>(defaultMode);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    const initial: ThemeMode = stored === "light" || stored === "dark" ? stored : defaultMode;
    setModeState(initial);
    applyTheme(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setMode = (m: ThemeMode) => {
    setModeState(m);
    localStorage.setItem(STORAGE_KEY, m);
    applyTheme(m);
  };

  const toggle = () => setMode(mode === "dark" ? "light" : "dark");

  const value = useMemo(() => ({ mode, setMode, toggle }), [mode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
