import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { Flashcard } from "../api/flashcards";
import { fetchFlashcards } from "../api/flashcards";
import "../styles/flashcard.css";

type Attempt = "no" | "kinda" | "yes";

/* ===============================
   PROPS
   =============================== */
interface FlashcardStudyProps {
  flashcards?: Flashcard[];
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function FlashcardStudy({
  flashcards,
}: FlashcardStudyProps) {
  const [originalCards, setOriginalCards] = useState<Flashcard[]>([]);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const [attempts, setAttempts] = useState<Record<number, Attempt>>({});
  const [pendingAttempt, setPendingAttempt] =
    useState<Attempt | null>(null);

  const [showResetModal, setShowResetModal] = useState(false);
  const [shuffled, setShuffled] = useState(false);

  /* ===============================
     LOAD FLASHCARDS
     =============================== */
  useEffect(() => {
    // ✅ If flashcards are passed as props, use them
    if (flashcards && flashcards.length > 0) {
      setOriginalCards(flashcards);
      setCards(flashcards);
      return;
    }

    // ✅ Otherwise, fetch from API (current behavior)
    fetchFlashcards().then((data) => {
      setOriginalCards(data);
      setCards(data);
    });
  }, [flashcards]);

  /* ===============================
     LOAD / SAVE ATTEMPTS
     =============================== */
  useEffect(() => {
    const saved = localStorage.getItem("flashcardAttempts");
    if (saved) setAttempts(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "flashcardAttempts",
      JSON.stringify(attempts)
    );
  }, [attempts]);

  if (!cards.length) return <div>Loading flashcards…</div>;

  const card = cards[index];
  const previousAttempt = attempts[card.id];

  function toggleFlip() {
    setFlipped((f) => !f);
  }

  function selectAttempt(value: Attempt) {
    setPendingAttempt((prev) =>
      prev === value ? null : value
    );
  }

  function commitAttempt() {
    if (!pendingAttempt) return;
    setAttempts((prev) => ({
      ...prev,
      [card.id]: pendingAttempt,
    }));
  }

  function goNext() {
    commitAttempt();
    setPendingAttempt(null);
    setFlipped(false);
    setIndex((i) => Math.min(i + 1, cards.length - 1));
  }

  function goPrev() {
    commitAttempt();
    setPendingAttempt(null);
    setFlipped(false);
    setIndex((i) => Math.max(i - 1, 0));
  }

  function shuffleCards() {
    setCards(shuffleArray(originalCards));
    setIndex(0);
    setFlipped(false);
    setPendingAttempt(null);
    setShuffled(true);
  }

  function confirmReset() {
    setAttempts({});
    setPendingAttempt(null);
    setIndex(0);
    setFlipped(false);
    setShuffled(false);
    localStorage.removeItem("flashcardAttempts");
    setShowResetModal(false);
  }

  return (
    <div className="flashcard-page">
      {/* Header */}
      <div className="flashcard-header">
        <span>
          {index + 1} of {cards.length}
        </span>

        <div className="flashcard-actions">
          <button
            onClick={shuffleCards}
            className={`header-link ${
              shuffled ? "clicked" : ""
            }`}
            type="button"
          >
            Shuffle
          </button>

          <button
            onClick={() => setShowResetModal(true)}
            className="header-link"
            type="button"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Flashcard */}
      <div
        className={`flashcard ${flipped ? "flipped" : ""}`}
        onClick={toggleFlip}
      >
        <div className="flashcard-inner">
          <div className="flashcard-front">
            {card.term}
          </div>
          <div className="flashcard-back">
            {card.definition}
          </div>
        </div>
      </div>

      {/* Attempt buttons */}
      <div className="attempt-buttons">
        <button
          className={`attempt-btn no ${
            pendingAttempt === "no" ? "active" : ""
          }`}
          onClick={() => selectAttempt("no")}
        >
          No
        </button>

        <button
          className={`attempt-btn kinda ${
            pendingAttempt === "kinda" ? "active" : ""
          }`}
          onClick={() => selectAttempt("kinda")}
        >
          Kinda
        </button>

        <button
          className={`attempt-btn yes ${
            pendingAttempt === "yes" ? "active" : ""
          }`}
          onClick={() => selectAttempt("yes")}
        >
          Yes
        </button>
      </div>

      {/* Navigation */}
      <div className="nav-buttons">
        <button onClick={goPrev} disabled={index === 0}>
          Previous
        </button>
        <button
          onClick={goNext}
          disabled={index === cards.length - 1}
        >
          Next
        </button>
      </div>

      {previousAttempt && !pendingAttempt && (
        <div className="previous-attempt">
          Previous attempt:{" "}
          <strong>{previousAttempt}</strong>
        </div>
      )}

      {showResetModal &&
        createPortal(
          <div className="modal-overlay">
            <div className="modal">
              <h3>Reset progress?</h3>
              <p>This will clear all flashcard responses.</p>
              <p>This action cannot be undone.</p>

              <div className="modal-actions">
                <button
                  className="modal-cancel"
                  onClick={() =>
                    setShowResetModal(false)
                  }
                >
                  Cancel
                </button>
                <button
                  className="modal-confirm"
                  onClick={confirmReset}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
