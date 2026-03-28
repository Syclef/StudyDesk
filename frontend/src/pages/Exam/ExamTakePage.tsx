import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ExamAttempt,
  ExamQuestion,
  ExamSession,
  ExamUserAnswer,
} from "./examTypes";
import { buildExamSession, calcRemainingSeconds } from "./examUtils";
import { saveAttemptDraft } from "./examStorage";
import "../../styles/exam-engine.css";

type LocationState = {
  mode?: "full" | "domain" | "custom";
  domains?: number[];
  count?: number;
  minutes?: number;
};

export default function ExamTakePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = (location.state || {}) as LocationState;

  const mode = state.mode ?? "full";
  const domains = state.domains ?? [1, 2, 3, 4, 5];
  const count = state.count ?? 10;
  const minutes = state.minutes ?? 10;

  const [session] = useState<ExamSession>(() =>
    buildExamSession({
      mode,
      domains,
      count,
      minutes,
    })
  );

  const totalSeconds = minutes * 60;

  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, ExamUserAnswer>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [remaining, setRemaining] = useState(totalSeconds);

  const current: ExamQuestion = session.questions[idx];

  const progressPct = useMemo(() => {
    if (session.questions.length === 0) return 0;
    return ((idx + 1) / session.questions.length) * 100;
  }, [idx, session.questions.length]);

  // Ref for progress bar rail (so we can set CSS variable without inline styles)
  const progressRailRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!progressRailRef.current) return;
    progressRailRef.current.style.setProperty("--pp-progress", `${progressPct}%`);
  }, [progressPct]);

  // Force light theme inside exam (for now)
  useEffect(() => {
    const prev = document.documentElement.getAttribute("data-theme") || "dark";
    document.documentElement.setAttribute("data-theme", "light");
    return () => {
      document.documentElement.setAttribute("data-theme", prev);
    };
  }, []);

  // Timer
  useEffect(() => {
    const start = Date.now();
    const t = setInterval(() => {
      const next = calcRemainingSeconds(start, totalSeconds);
      setRemaining(next);

      if (next <= 0) {
        clearInterval(t);
        handleSubmit(true);
      }
    }, 250);

    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePick = (choiceId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [current.id]: { questionId: current.id, choiceId },
    }));
  };

  const toggleFlag = (qid: string) => {
    setFlagged((prev) => ({ ...prev, [qid]: !prev[qid] }));
  };

  const goTo = (i: number) => {
    if (i < 0 || i >= session.questions.length) return;
    setIdx(i);
  };

  const handleSubmit = (auto = false) => {
    const attempt: ExamAttempt = {
      id: session.id,
      createdAt: session.createdAt,
      mode: session.mode,
      domains: session.domains,
      durationMinutes: session.durationMinutes,
      questions: session.questions,
      answers,
      flagged,
      finishedAt: new Date().toISOString(),
      autoSubmitted: auto,
    };

    saveAttemptDraft(attempt);

    navigate("/exam/results", {
      state: { attemptId: attempt.id },
    });
  };

  const fmt = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const quitQuiz = () => {
    if (confirm("Quit quiz? Your progress will be lost.")) {
      navigate("/exam");
    }
  };

  return (
    <div className="pp-shell">
      {/* Header */}
      <div className="pp-header">
        <div className="pp-header-left">
          <div className="pp-brand">
            <div className="pp-brand-title">ISACA CISA®</div>
            <div className="pp-brand-subtitle">AuditStudyDesk</div>
          </div>
        </div>

        <div className="pp-header-center">
          <div className="pp-progress-rail" ref={progressRailRef}>
            <div className="pp-progress-fill" />
          </div>
        </div>

        <div className="pp-header-right">
          <button className="pp-quit" onClick={quitQuiz}>
            Quit Quiz
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="pp-body">
        <div className="pp-card">
          <div className="pp-meta">
            <div className="pp-timer">{fmt(remaining)}</div>
            <div className="pp-qcount">
              Question {idx + 1} / {session.questions.length}
            </div>
          </div>

          <div className="pp-question">{current.text}</div>

          <div className="pp-answers">
            {current.choices.map((c) => {
              const selected = answers[current.id]?.choiceId === c.id;
              return (
                <button
                  key={c.id}
                  className={`pp-choice ${selected ? "is-selected" : ""}`}
                  onClick={() => handlePick(c.id)}
                >
                  <span className="pp-choice-label">{c.label}</span>
                  <span className="pp-choice-text">{c.text}</span>
                </button>
              );
            })}
          </div>

          <div className="pp-grid">
            {session.questions.map((q, i) => {
              const isActive = i === idx;
              const answered = Boolean(answers[q.id]);
              const isFlagged = Boolean(flagged[q.id]);
              return (
                <button
                  key={q.id}
                  className={[
                    "pp-grid-btn",
                    isActive ? "active" : "",
                    answered ? "answered" : "",
                    isFlagged ? "flagged" : "",
                  ].join(" ")}
                  onClick={() => goTo(i)}
                  title={isFlagged ? "Flagged" : ""}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>

          <div className="pp-footer">
            <button
              className="pp-nav"
              onClick={() => goTo(idx - 1)}
              disabled={idx === 0}
            >
              ‹
            </button>

            <button
              className={`pp-flag ${flagged[current.id] ? "on" : ""}`}
              onClick={() => toggleFlag(current.id)}
              title="Flag for review"
            >
              ⚑
            </button>

            <button
              className="pp-nav"
              onClick={() => goTo(idx + 1)}
              disabled={idx === session.questions.length - 1}
            >
              ›
            </button>

            <div className="pp-submit-wrap">
              <button className="pp-submit" onClick={() => handleSubmit(false)}>
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
