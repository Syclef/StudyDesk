import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { computeExamCycles, PASS_THRESHOLD } from "../../utils/examCycles";

const API_BASE = "http://127.0.0.1:4000";

interface AttemptSummary {
  id: string;
  mode: string;
  mockSlot: number | null;
  score: number | null;
  total: number | null;
  percent: number | null;
  startedAt: string;
  submittedAt: string | null;
}

export default function ExamLandingPage() {
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState<AttemptSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAttempts = () => {
    fetch(`${API_BASE}/attempts`)
      .then((r) => r.json())
      .then((data: AttemptSummary[]) => {
        setAttempts(data.filter((a) => a.mode === "EXAM" && a.total && a.total >= 100));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchAttempts(); }, []);

  const scoreColor = (pct: number | null) => {
    if (pct === null) return "var(--muted)";
    if (pct >= PASS_THRESHOLD) return "var(--success, #32d74b)";
    if (pct >= 60) return "var(--warning, #ff9f0a)";
    return "var(--danger, #ff453a)";
  };

  const totalAttempts = attempts.length;
  const bestScore = attempts.length > 0 ? Math.max(...attempts.map(a => a.percent ?? 0)) : null;
  const lastScore = attempts.length > 0 ? attempts[0].percent : null;
  const passes = attempts.filter(a => (a.percent ?? 0) >= PASS_THRESHOLD).length;

  // Real per-slot lookup (most recent attempt on that exact Exam Set, ever)
  // — replaces the old positional guess that assumed attempts always
  // happened in Set 1→5 order, which breaks the moment anything is retaken.
  const attemptsBySlot: Record<number, AttemptSummary | null> = {};
  for (let slot = 1; slot <= 5; slot++) {
    const slotAttempts = attempts.filter(a => a.mockSlot === slot);
    attemptsBySlot[slot] = slotAttempts[0] ?? null; // attempts is already sorted desc by submittedAt
  }

  // Cycle state — which sets have been used since the last completed cycle
  // (all 5 distinct sets attempted). Used to warn before a retake that would
  // overwrite that set's score for the in-progress cycle.
  const { currentCycleUsed } = computeExamCycles(attempts);

  const startExamSet = (slot: number) => {
    const alreadyUsedThisCycle = currentCycleUsed.get(slot);
    if (alreadyUsedThisCycle) {
      const proceed = confirm(
        `You've already completed Exam Set ${slot} this cycle (scored ${alreadyUsedThisCycle.percent}%). ` +
        `Retaking it now will replace that score for your current readiness cycle. Continue?`
      );
      if (!proceed) return;
    }
    navigate("/exam/intro", {
      state: { mode: "full", domains: [1, 2, 3, 4, 5], count: 150, minutes: 240, mock: slot },
    });
  };

  return (
    <div style={{ padding: 32, maxWidth: 860, margin: "0 auto", color: "var(--text)" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px 0", letterSpacing: "-0.3px" }}>Exam</h1>
      <p style={{ color: "var(--muted)", fontSize: 13, margin: "0 0 24px 0" }}>
        Simulate the real CISA exam — 150 questions · 4 hours · domain-weighted · timed
      </p>

      {/* Metrics */}
      {!loading && totalAttempts > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
          {[
            { label: "Attempts", value: totalAttempts, color: "var(--text)" },
            { label: "Last Score", value: lastScore !== null ? `${lastScore}%` : "—", color: scoreColor(lastScore) },
            { label: "Best Score", value: bestScore !== null ? `${bestScore}%` : "—", color: scoreColor(bestScore) },
            { label: "Passed", value: `${passes}/${totalAttempts}`, color: passes > 0 ? "var(--success, #32d74b)" : "var(--danger, #ff453a)" },
          ].map((m) => (
            <div key={m.label} style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: 10, padding: "12px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: m.color }}>{m.value}</div>
              <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{m.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Recent attempts */}
      {!loading && attempts.length > 0 && (
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: 10, padding: "12px 16px", marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Recent Attempts</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {attempts.slice(0, 5).map((a, i) => {
              const pct = a.percent ?? 0;
              const label = pct >= PASS_THRESHOLD ? "PASS" : pct >= 60 ? "BORDERLINE" : "FAIL";
              const color = scoreColor(a.percent);
              return (
                <div key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
                  <span style={{ color: "var(--text)", fontWeight: 600 }}>
                    Exam Set {a.mockSlot ?? "?"} · Attempt #{attempts.length - i}
                  </span>
                  <span style={{ color: "var(--muted)", fontSize: 12 }}>
                    {a.submittedAt ? new Date(a.submittedAt).toLocaleDateString() : "—"}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 999, background: `${color}20`, color }}>{label}</span>
                    <span style={{ fontWeight: 700, color }}>{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Exam Sets header + reset */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <h2 style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>Exam Sets</h2>
        {attempts.length > 0 && (
          <button
            onClick={() => {
              if (confirm("Reset all exam progress? This cannot be undone.")) {
                fetch(`${API_BASE}/attempts/exam`, { method: "DELETE" })
                  .then(() => setAttempts([]));
              }
            }}
            style={{ background: "none", border: "1px solid var(--border)", borderRadius: 8, padding: "4px 10px", color: "var(--muted)", cursor: "pointer", fontSize: 12 }}
          >↺ Reset</button>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {[1, 2, 3, 4, 5].map((n) => {
          const slotAttempt = attemptsBySlot[n];
          const pct = slotAttempt?.percent ?? null;
          const passed = pct !== null && pct >= PASS_THRESHOLD;
          const attempted = slotAttempt !== null;
          const color = scoreColor(pct);
          const usedThisCycle = currentCycleUsed.has(n);

          return (
            <div key={n} style={{
              display: "flex", alignItems: "center",
              background: "var(--card-bg)", border: "1px solid var(--card-border)",
              borderRadius: 10, padding: "14px 18px", gap: 12,
            }}>
              {/* Status dot */}
              <div style={{
                width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                background: passed ? "var(--success, #32d74b)" : attempted ? "var(--warning, #ff9f0a)" : "var(--border)",
              }} />

              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text)" }}>Exam Set {n}</div>
                  {usedThisCycle && (
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 999,
                      background: "var(--accent-light, rgba(0,113,227,0.10))", color: "var(--accent)",
                    }}>
                      Used this cycle
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
                  {attempted
                    ? `Last: ${pct}% · ${slotAttempt?.submittedAt ? new Date(slotAttempt.submittedAt).toLocaleDateString() : ""}`
                    : "150 questions · 4 hours · CISA weighted · timed"}
                </div>
              </div>

              <button
                onClick={() => startExamSet(n)}
                style={{
                  background: "var(--accent)", color: "#fff", border: "none",
                  borderRadius: 8, padding: "7px 18px",
                  fontSize: 13, fontWeight: 600, cursor: "pointer",
                }}
              >{attempted ? "Retake" : "Start"}</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
