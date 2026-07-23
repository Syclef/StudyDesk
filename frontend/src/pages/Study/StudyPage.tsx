import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getStudyProgress, clearCategoryProgress, clearAllStudyProgress, type StudyCategoryProgress } from "../../utils/studyProgress";
import "../../styles/study-plan.css";

const API_BASE = "http://127.0.0.1:4000";

interface CategorySummary {
  domain: string;
  categories: { name: string; count: number }[];
}

const DOMAIN_NAMES: Record<string, string> = {
  D1: "Information System Auditing Process",
  D2: "Governance and Management of IT",
  D3: "Information Systems Acquisition, Development, and Implementation",
  D4: "Information Systems Operations and Business Resilience",
  D5: "Protection of Information Assets",
};

const MUTED = "#94a3b8";

function getOpenDomains(): Set<string> {
  try {
    const saved = sessionStorage.getItem("study_open_domains");
    return saved ? new Set(JSON.parse(saved)) : new Set(["D1"]);
  } catch {
    return new Set(["D1"]);
  }
}

function saveOpenDomains(domains: Set<string>) {
  sessionStorage.setItem("study_open_domains", JSON.stringify([...domains]));
}

export default function StudyPage() {
  const navigate = useNavigate();
  const [openDomains, setOpenDomains] = useState<Set<string>>(getOpenDomains);
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [progress, setProgress] = useState<Record<string, StudyCategoryProgress>>({});
  // Combined Study+Practice+Exam accuracy per category — same underlying
  // data Focus Areas uses, fetched here so "which topic is weak" reflects
  // ALL your activity, not just Study-mode sessions (the local `progress`
  // above only knows about Study, so it'd show nothing for a category
  // you've only ever seen through Practice or Exam).
  const [combinedProgress, setCombinedProgress] = useState<Record<string, { attempted: number; correct: number; total: number }>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/categories`)
      .then((r) => r.json())
      .then((data: CategorySummary[]) => {
        setCategories(data);
        setProgress(getStudyProgress());
        setLoading(false);
      })
      .catch(() => setLoading(false));

    fetch(`${API_BASE}/progress/categories`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data: { category: string; attempted: number; correct: number; total: number }[]) => {
        const map: Record<string, { attempted: number; correct: number; total: number }> = {};
        for (const row of data) map[row.category] = row;
        setCombinedProgress(map);
      })
      .catch(() => setCombinedProgress({}));
  }, []);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        setProgress(getStudyProgress());
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  useEffect(() => {
    // One-time deep-link support: Dashboard's Current Study Plan / Focus
    // Areas set this before navigating here, so clicking a specific domain
    // actually lands you on it (expanded + scrolled to) instead of just the
    // generic Study page.
    const target = sessionStorage.getItem("study_scroll_target");
    if (target) {
      sessionStorage.removeItem("study_scroll_target");
      requestAnimationFrame(() => {
        document.getElementById(`domain-${target}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, []);

  const toggleDomain = (code: string) => {
    setOpenDomains((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      saveOpenDomains(next);
      return next;
    });
  };

  const resetCategory = (catName: string) => {
    clearCategoryProgress(catName);
    setProgress(getStudyProgress());
  };

  const resetAll = () => {
    if (confirm("Reset all study progress? This cannot be undone.")) {
      clearAllStudyProgress();
      setProgress({});
    }
  };

  const getCategoriesForDomain = (domainCode: string) => {
    return categories.find((c) => c.domain === domainCode)?.categories ?? [];
  };

  return (
    <div className="dashboard-wrapper">
      <main className="main-content">
        <header className="dashboard-header">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%" }}>
            <div>
              <h1 className="dash-title">Study</h1>
              <p className="dash-subtitle">Study by domain and category</p>
            </div>
            <button
              onClick={resetAll}
              style={{ background: "none", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, padding: "6px 12px", color: MUTED, cursor: "pointer", fontSize: 12, marginTop: 4 }}
            >
              Reset All Progress
            </button>
          </div>
        </header>

        <section className="domains-container">
          <h3 className="section-title">Knowledge Domains</h3>
          {loading ? (
            <p style={{ color: "rgba(255,255,255,0.5)", padding: "20px 0" }}>Loading...</p>
          ) : (
            <div className="sp-domains">
              {Object.entries(DOMAIN_NAMES).map(([code, name]) => {
                const isOpen = openDomains.has(code);
                const domainCategories = getCategoriesForDomain(code);

                const domainAttempted = domainCategories.reduce((s, c) => s + (progress[c.name]?.attempted ?? 0), 0);
                const domainTotal = domainCategories.reduce((s, c) => s + c.count, 0);
                const domainPct = domainTotal > 0 ? Math.min(100, Math.round((domainAttempted / domainTotal) * 100)) : 0;

                return (
                  <div key={code} id={`domain-${code}`} className="sp-domain">
                    <div className="sp-domain-header" onClick={() => toggleDomain(code)}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: domainPct > 0 ? 6 : 0 }}>
                          <span>{name}</span>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            {domainPct > 0 && (
                              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.50)" }}>{domainPct}% done</span>
                            )}
                            <span className="chevron">{isOpen ? "▾" : "▸"}</span>
                          </div>
                        </div>
                        {domainPct > 0 && (
                          <div style={{ height: 3, borderRadius: 999, background: "rgba(255,255,255,0.10)", overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${domainPct}%`, background: "#3b82f6", borderRadius: 999 }} />
                          </div>
                        )}
                      </div>
                    </div>

                    {isOpen && (
                      <div className="sp-domain-tasks">
                        {domainCategories.length === 0 ? (
                          <p style={{ padding: "12px 16px", color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
                            No questions available yet.
                          </p>
                        ) : (
                          (() => {
                            // Priority: proven-weak categories first (weakest accuracy
                            // first), then never-attempted ones (need coverage), then
                            // already-strong ones last (least urgent). This answers
                            // "which specific topic should I focus on," not just
                            // "which domain" — a category can be buried inside a
                            // fine-looking domain average and still be the real problem.
                            const priority = (cat: { name: string; count: number }) => {
                              const c = combinedProgress[cat.name];
                              const acc = c && c.attempted > 0 ? (c.correct / c.attempted) * 100 : null;
                              if (acc === null) return 1000;
                              if (acc < 75) return acc;
                              return 2000 + acc;
                            };
                            const sortedCategories = [...domainCategories].sort((a, b) => priority(a) - priority(b));
                            const topPriority = sortedCategories.length > 0 ? priority(sortedCategories[0]) : Infinity;
                            const focusHereName = topPriority < 75 ? sortedCategories[0].name : null;

                            return sortedCategories.map((cat) => {
                              const p = progress[cat.name];
                              const c = combinedProgress[cat.name];
                              const pct = p ? Math.min(100, Math.round((p.attempted / cat.count) * 100)) : 0;
                              const accuracy = c && c.attempted > 0 ? Math.round((c.correct / c.attempted) * 100) : null;
                              const accuracyColor = accuracy === null ? MUTED : accuracy >= 75 ? "#4ade80" : accuracy >= 60 ? "#fbbf24" : "#f87171";
                              const isFocusHere = cat.name === focusHereName;

                              return (
                                <div key={cat.name} className="sp-task" style={{
                                  flexDirection: "column", alignItems: "stretch", gap: 8,
                                  ...(isFocusHere ? { border: "1px solid #f87171", borderRadius: 8, padding: 8 } : {}),
                                }}>
                                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                      <strong style={{ fontSize: 13 }}>{cat.name}</strong>
                                      {isFocusHere && (
                                        <span style={{
                                          fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 999,
                                          background: "rgba(248,113,113,0.15)", color: "#f87171",
                                        }}>
                                          Focus here
                                        </span>
                                      )}
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                      {accuracy !== null && (
                                        <span style={{ fontSize: 12, fontWeight: 600, color: accuracyColor }}>{accuracy}%</span>
                                      )}
                                      {pct > 0 && (
                                        <button
                                          onClick={(e) => { e.stopPropagation(); resetCategory(cat.name); }}
                                          title="Reset progress for this category"
                                          style={{ background: "none", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 6, padding: "2px 6px", fontSize: 11, color: MUTED, cursor: "pointer" }}
                                        >↺</button>
                                      )}
                                      <button
                                        className="study-btn"
                                        onClick={() => navigate(`/session/study/${encodeURIComponent(cat.name)}`)}
                                      >
                                        {pct > 0 ? "Study Again" : "Study"}
                                      </button>
                                    </div>
                                  </div>
                                  <div style={{ height: 4, borderRadius: 999, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                                    <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? "#4ade80" : "#3b82f6", borderRadius: 999, transition: "width 0.3s" }} />
                                  </div>
                                </div>
                              );
                            });
                          })()
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
