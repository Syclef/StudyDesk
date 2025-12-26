import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchQuestions } from "../api/questions";
import type { Question } from "../api/questions";
import { saveExamAttempt } from "../utils/examStorage";

/**
 * Exam Mode
 * - Timed
 * - Answers locked after selection
 * - Anti-cheat protections
 * - Saves attempt
 * - Navigates to Review Mode
 */

// Toggle if you want to allow only one active attempt
const SINGLE_ATTEMPT = false;

export default function Exam() {
  const navigate = useNavigate();

  /* ===================== STATE ===================== */

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // answers: { questionId: "A" | "B" | "C" | "D" }
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 60-minute exam
  const [timeLeft, setTimeLeft] = useState(60 * 60);

  /* ===================== LOAD QUESTIONS ===================== */

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchQuestions();
        setQuestions(data);
      } catch {
        setError("Unable to load exam questions");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  /* ===================== SINGLE-ATTEMPT GUARD ===================== */

  useEffect(() => {
    if (!SINGLE_ATTEMPT) return;

    if (localStorage.getItem("examInProgress")) {
      alert("An exam session is already in progress.");
      navigate("/practice");
      return;
    }

    localStorage.setItem("examInProgress", "true");

    return () => {
      localStorage.removeItem("examInProgress");
    };
  }, [navigate]);

  /* ===================== PREVENT REFRESH / CLOSE ===================== */

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  /* ===================== TAB SWITCH WARNING ===================== */

  useEffect(() => {
    const onBlur = () => {
      alert(
        "You left the exam window. Please remain on the exam until completion."
      );
    };

    window.addEventListener("blur", onBlur);
    return () => window.removeEventListener("blur", onBlur);
  }, []);

  /* ===================== DISABLE BACK BUTTON ===================== */

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    const onPopState = () => {
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  /* ===================== TIMER ===================== */

  useEffect(() => {
    if (timeLeft <= 0) {
      endExam();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  /* ===================== HELPERS ===================== */

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  function selectAnswer(choice: string) {
    const q = questions[currentIndex];
    if (answers[q.id]) return; // 🔒 lock answer

    setAnswers({
      ...answers,
      [q.id]: choice,
    });
  }

  function endExam() {
    // Save attempt locally
    saveExamAttempt(questions, answers);

    // Navigate to Review Mode
    navigate("/review", {
      state: {
        questions,
        answers,
      },
    });
  }

  /* ===================== UI STATES ===================== */

  if (loading) return <div>Loading exam…</div>;
  if (error) return <div>{error}</div>;
  if (questions.length === 0) return <div>No questions available</div>;

  const question = questions[currentIndex];
  const selected = answers[question.id];

  /* ===================== RENDER ===================== */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Exam Mode</h1>
        <span className="font-mono text-sm">
          Time left: {formatTime(timeLeft)}
        </span>
      </div>

      <p className="text-sm text-gray-500">
        Question {currentIndex + 1} of {questions.length}
      </p>

      {/* Question */}
      <div className="border rounded-lg p-4 bg-white shadow">
        <p className="font-semibold mb-4">{question.question}</p>

        <div className="space-y-2">
          {Object.entries(question.choices).map(([key, value]) => (
            <button
              key={key}
              onClick={() => selectAnswer(key)}
              disabled={!!selected}
              className={`w-full text-left p-2 border rounded transition
                ${
                  selected === key
                    ? "border-blue-600 bg-blue-100"
                    : "hover:bg-gray-50"
                }`}
            >
              <strong>{key}.</strong> {value}
            </button>
          ))}
        </div>

        <p className="mt-3 text-sm text-gray-500">
          Domain {question.domain}
        </p>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((i) => i - 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>

        {currentIndex === questions.length - 1 ? (
          <button
            onClick={endExam}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            End Exam
          </button>
        ) : (
          <button
            onClick={() => setCurrentIndex((i) => i + 1)}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
