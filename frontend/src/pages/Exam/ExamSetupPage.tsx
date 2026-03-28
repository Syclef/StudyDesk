import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/exam-engine.css";

type ExamMode = "full" | "domain" | "custom";

const DOMAIN_OPTIONS = [
  { n: 1, label: "Domain 1" },
  { n: 2, label: "Domain 2" },
  { n: 3, label: "Domain 3" },
  { n: 4, label: "Domain 4" },
  { n: 5, label: "Domain 5" },
];

export default function ExamSetupPage() {
  const navigate = useNavigate();

  const [mode, setMode] = useState<ExamMode>("full");
  const [selectedDomains, setSelectedDomains] = useState<number[]>([1, 2, 3, 4, 5]);
  const [count, setCount] = useState<number>(10);
  const [minutes, setMinutes] = useState<number>(10);

  const modeDomains = useMemo(() => {
    if (mode === "domain") return [selectedDomains[0] ?? 1];
    if (mode === "custom") return selectedDomains.length ? selectedDomains : [1, 2, 3, 4, 5];
    return [1, 2, 3, 4, 5];
  }, [mode, selectedDomains]);

  const toggleDomain = (d: number) => {
    setSelectedDomains((prev) => {
      if (prev.includes(d)) return prev.filter((x) => x !== d);
      return [...prev, d].sort((a, b) => a - b);
    });
  };

  const startExam = () => {
    navigate("/exam/take", {
      state: {
        mode,
        domains: modeDomains,
        count,
        minutes,
      },
    });
  };

  return (
    <div className="exam-setup-page">
      <div className="exam-setup-card">
        <h1 className="exam-setup-title">Exam Setup</h1>

        {/* MODE */}
        <section className="exam-section">
          <h2 className="exam-section-title">Mode</h2>

          <div className="exam-mode-row">
            <button
              className={`exam-pill ${mode === "full" ? "active" : ""}`}
              onClick={() => setMode("full")}
              type="button"
            >
              Full Exam
            </button>
            <button
              className={`exam-pill ${mode === "domain" ? "active" : ""}`}
              onClick={() => {
                setMode("domain");
                setSelectedDomains((prev) => (prev.length ? [prev[0]] : [1]));
              }}
              type="button"
            >
              Domain Exam
            </button>
            <button
              className={`exam-pill ${mode === "custom" ? "active" : ""}`}
              onClick={() => setMode("custom")}
              type="button"
            >
              Custom Quiz
            </button>
          </div>
        </section>

        {/* DOMAINS */}
        <section className="exam-section">
          <h2 className="exam-section-title">Domains</h2>

          {mode === "domain" ? (
            <div className="exam-field">
              <label htmlFor="domainSelect">Choose a domain</label>
              <select
                id="domainSelect"
                aria-label="Choose a domain"
                title="Choose a domain"
                value={selectedDomains[0] ?? 1}
                onChange={(e) => setSelectedDomains([Number(e.target.value)])}
              >
                {DOMAIN_OPTIONS.map((d) => (
                  <option key={d.n} value={d.n}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="exam-domain-grid">
              {DOMAIN_OPTIONS.map((d) => {
                const isOn =
                  mode === "full" ? true : selectedDomains.includes(d.n);

                return (
                  <button
                    key={d.n}
                    type="button"
                    className={`exam-domain-chip ${isOn ? "on" : ""}`}
                    disabled={mode === "full"}
                    onClick={() => toggleDomain(d.n)}
                    title={d.label}
                  >
                    {d.label}
                  </button>
                );
              })}
            </div>
          )}

          {mode === "full" && (
            <div className="exam-help">
              Full Exam always includes Domains 1–5.
            </div>
          )}
        </section>

        {/* SETTINGS */}
        <section className="exam-section">
          <h2 className="exam-section-title">Settings</h2>

          <div className="exam-field">
            <label htmlFor="countInput">Number of questions</label>
            <input
              id="countInput"
              type="number"
              aria-label="Number of questions"
              title="Number of questions"
              min={1}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
            />
          </div>

          <div className="exam-field">
            <label htmlFor="minutesInput">Timer (minutes)</label>
            <input
              id="minutesInput"
              type="number"
              aria-label="Timer in minutes"
              title="Timer in minutes"
              min={1}
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
            />
          </div>
        </section>

        {/* ACTION */}
        <div className="exam-actions">
          <button className="exam-start-btn" onClick={startExam} type="button">
            Start Exam
          </button>
        </div>
      </div>
    </div>
  );
}
