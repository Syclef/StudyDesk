import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App";
import { ThemeProvider } from "./utils/theme";
import { installAuthFetch } from "./utils/apiFetch";

/* GLOBAL STYLES */
import "./index.css";

/* FEATURE STYLES */
import "./styles/flashcard.css";
import "./styles/card-picker.css";
import "./styles/practice.css";
import "./styles/exam.css";
import "./styles/exam-engine.css";
import "./styles/study-plan.css";

// Must run before any component mounts and fires its first fetch() call —
// this is what makes every existing API call in the app send the session
// cookie, without needing to edit each call site individually.
installAuthFetch();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultMode="dark"><App /></ThemeProvider>
  </StrictMode>
);