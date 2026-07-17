import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ExamAttempt, ExamQuestion, ExamSession, ExamUserAnswer } from "./examTypes";
import { buildExamSession, calcRemainingSeconds } from "./examUtils";
import { saveAttemptDraft } from "./examStorage";

type LocationState = {
  mode?: "full" | "domain" | "custom";
  domains?: number[];
  count?: number;
  minutes?: number;
  mock?: number;
};

type Phase = "loading" | "taking" | "review";

const BG = "#0f1b2d";
const CARD = "#1a2540";
const TEXT = "#e5eaf1";
const MUTED = "#94a3b8";
const BORDER = "rgba(255,255,255,0.10)";
const ACCENT = "#3b82f6";
const SUCCESS = "#4ade80";
const DANGER = "#f87171";
const WARNING = "#fbbf24";

function renderQuestionText(text: string, color: string): React.ReactNode {
  // Check if text contains newlines (scenario/bullet format)
  if (!text.includes('\n')) return <span style={{ color }}>{text}</span>;

  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  
  return (
    <div>
      {lines.map((line, i) => {
        if (line.startsWith('- ') || line.startsWith('• ')) {
          return (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, color }}>
              <span style={{ flexShrink: 0 }}>•</span>
              <span style={{ lineHeight: 1.5 }}>{line.replace(/^[-•]\s*/, '')}</span>
            </div>
          );
        }
        return (
          <p key={i} style={{ margin: i === lines.length - 1 ? 0 : '0 0 8px 0', color, lineHeight: 1.6 }}>
            {line}
          </p>
        );
      })}
    </div>
  );
}

export default function ExamTakePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state || {}) as LocationState;

  const mode = state.mode ?? "full";
  const domains = state.domains ?? [1, 2, 3, 4, 5];
  const count = state.count ?? 150;
  const minutes = state.minutes ?? 240;
  const mock = state.mock;

  const [session, setSession] = useState<ExamSession | null>(null);
  const [phase, setPhase] = useState<Phase>("loading");
  const totalSeconds = (mock ? 240 : minutes) * 60;

  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, ExamUserAnswer>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [remaining, setRemaining] = useState(totalSeconds);

  useEffect(() => {
    buildExamSession({ mode, domains, count, minutes, mock })
      .then((s) => { setSession(s); setPhase("taking"); })
      .catch(() => navigate("/exam"));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const current: ExamQuestion | undefined = session?.questions[idx];

  useEffect(() => {
    if (phase !== "taking" || !session) return;
    const start = Date.now();
    const t = setInterval(() => {
      const next = calcRemainingSeconds(start, totalSeconds);
      setRemaining(next);
      if (next <= 0) { clearInterval(t); finalSubmit(true); }
    }, 250);
    return () => clearInterval(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, phase]);

  const handlePick = (choiceId: string) => {
    if (!current) return;
    setAnswers((prev) => ({ ...prev, [current.id]: { questionId: current.id, choiceId } }));
  };

  const toggleFlag = (qid: string) => {
    setFlagged((prev) => ({ ...prev, [qid]: !prev[qid] }));
  };

  const goTo = (i: number) => {
    if (!session || i < 0 || i >= session.questions.length) return;
    setIdx(i);
  };

  const finalSubmit = (auto = false) => {
    if (!session) return;
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
    navigate("/exam/results");
  };

  const fmt = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const timerColor = remaining < 300 ? DANGER : MUTED;

  const pageStyle: React.CSSProperties = {
    minHeight: "100vh",
    background: BG,
    color: TEXT,
    padding: "24px 32px",
    maxWidth: 860,
    margin: "0 auto",
  };

  if (phase === "loading" || !session || !current) {
    return (
      <div style={pageStyle}>
        <p style={{ color: MUTED }}>Loading questions…</p>
      </div>
    );
  }

  const totalQ = session.questions.length;
  const answeredCount = Object.keys(answers).length;
  const flaggedCount = Object.values(flagged).filter(Boolean).length;
  const unansweredCount = totalQ - answeredCount;
  const isLast = idx === totalQ - 1;

  // ── Review screen ──────────────────────────────────────────────────────────
  if (phase === "review") {
    return (
      <div style={pageStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Review Before Submitting</h1>
          <span style={{ fontSize: 13, color: timerColor, fontWeight: 700 }}>{fmt(remaining)}</span>
        </div>

        {/* Summary cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
          {[
            { label: "Answered", value: answeredCount, color: SUCCESS },
            { label: "Unanswered", value: unansweredCount, color: unansweredCount > 0 ? DANGER : SUCCESS },
            { label: "Flagged", value: flaggedCount, color: WARNING },
          ].map((s) => (
            <div key={s.label} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 16, textAlign: "center" }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Question grid */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: TEXT }}>Question Overview</div>
          <div style={{ display: "flex", gap: 12, marginBottom: 12, fontSize: 12, color: MUTED }}>
            <span><span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 3, background: "rgba(74,222,128,0.5)", marginRight: 4 }} />Answered</span>
            <span><span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 3, background: "rgba(248,113,113,0.5)", marginRight: 4 }} />Unanswered</span>
            <span><span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 3, background: "rgba(251,191,36,0.5)", marginRight: 4 }} />Flagged</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {session.questions.map((q, i) => {
              const answered = Boolean(answers[q.id]);
              const isFlagged = Boolean(flagged[q.id]);
              let bg = "rgba(248,113,113,0.25)";
              let border = "rgba(248,113,113,0.40)";
              if (isFlagged) { bg = "rgba(251,191,36,0.25)"; border = "rgba(251,191,36,0.50)"; }
              else if (answered) { bg = "rgba(74,222,128,0.20)"; border = "rgba(74,222,128,0.40)"; }
              return (
                <button
                  key={q.id}
                  onClick={() => { setPhase("taking"); setIdx(i); }}
                  style={{ width: 36, height: 36, borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: "pointer", border: `1px solid ${border}`, background: bg, color: TEXT }}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>

        {unansweredCount > 0 && (
          <p style={{ fontSize: 13, color: DANGER, marginBottom: 16 }}>
            ⚠ You have {unansweredCount} unanswered question{unansweredCount > 1 ? "s" : ""}. You can still go back and answer them.
          </p>
        )}

        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={() => finalSubmit(false)}
            style={{ background: DANGER, color: "#fff", border: "none", borderRadius: 10, padding: "12px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}
          >
            Confirm Submit
          </button>
          <button
            onClick={() => setPhase("taking")}
            style={{ background: "none", color: MUTED, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "12px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}
          >
            Continue Exam
          </button>
        </div>
      </div>
    );
  }

  // ── Taking ─────────────────────────────────────────────────────────────────
  return (
    <div style={pageStyle}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
          {mock ? `Exam Set ${mock}` : "Custom Quiz"}
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: timerColor }}>{fmt(remaining)}</span>
          <button
            onClick={() => { if (confirm("Quit? Progress will be lost.")) navigate("/exam"); }}
            style={{ background: "none", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "6px 14px", color: TEXT, cursor: "pointer", fontSize: 13 }}
          >Exit</button>
        </div>
      </div>

      {/* Progress */}
      <div style={{ fontSize: 12, color: MUTED, marginBottom: 6 }}>
        Question {idx + 1} of {totalQ} · Answered: {answeredCount}
      </div>
      <div style={{ width: "100%", height: 6, borderRadius: 999, background: "rgba(255,255,255,0.08)", marginBottom: 20, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${((idx + 1) / totalQ) * 100}%`, background: ACCENT, borderRadius: 999, transition: "width 0.2s" }} />
      </div>

      {/* Question card */}
      <div style={{ background: CARD, borderRadius: 12, padding: 24, marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: MUTED, marginBottom: 8 }}>
          {current.domain ? `D${current.domain}` : ""}{current.ks ? ` · ${current.ks}` : ""}
          {flagged[current.id] && <span style={{ marginLeft: 8, color: WARNING, fontWeight: 700 }}>⚑ Flagged</span>}
        </div>

        <div style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.6, marginBottom: 20 }}>
          {renderQuestionText(current.text, TEXT)}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {current.choices.map((c) => {
            const isSelected = answers[current.id]?.choiceId === c.id;
            return (
              <div
                key={c.id}
                onClick={() => handlePick(c.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "14px 16px", borderRadius: 8,
                  border: `1px solid ${isSelected ? ACCENT : BORDER}`,
                  background: isSelected ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.04)",
                  color: TEXT, cursor: "pointer", transition: "all 0.15s",
                }}
              >
                <span style={{ fontWeight: 700, width: 20, flexShrink: 0 }}>{c.label}</span>
                <span style={{ fontSize: 14, lineHeight: 1.5 }}>{c.text}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer buttons */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button
          onClick={() => goTo(idx - 1)}
          disabled={idx === 0}
          style={{
            background: "none", border: `1px solid ${BORDER}`, borderRadius: 8,
            padding: "10px 20px", fontSize: 13, color: idx === 0 ? "rgba(255,255,255,0.25)" : MUTED,
            cursor: idx === 0 ? "not-allowed" : "pointer",
          }}
        >‹ Prev</button>

        <button
          onClick={() => toggleFlag(current.id)}
          style={{
            background: flagged[current.id] ? "rgba(251,191,36,0.15)" : "none",
            border: `1px solid ${flagged[current.id] ? "rgba(251,191,36,0.40)" : BORDER}`,
            borderRadius: 8, padding: "10px 20px", fontSize: 13,
            color: flagged[current.id] ? WARNING : MUTED, cursor: "pointer",
          }}
        >⚑ {flagged[current.id] ? "Unflag" : "Flag"}</button>

        {isLast ? (
          <button
            onClick={() => setPhase("review")}
            style={{ background: DANGER, border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer" }}
          >Review Exam ›</button>
        ) : (
          <button
            onClick={() => goTo(idx + 1)}
            style={{ background: ACCENT, border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer" }}
          >Next ›</button>
        )}
      </div>
    </div>
  );
}
