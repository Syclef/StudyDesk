import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

/* GLOBAL STYLES */
import "./index.css";

/* FEATURE STYLES */
import "./styles/flashcard.css";
import "./styles/card-picker.css";
import "./styles/game-center.css";
import "./styles/practice.css";
import "./styles/exam.css";
import "./styles/study-plan.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
