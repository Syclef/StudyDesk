import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

/* Feature styles */
import "./styles/flashcard.css";
import "./styles/card-picker.css";
import "./styles/practice.css";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
