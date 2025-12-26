import React, { useEffect, useState } from "react";

interface CategoryPracticeDTO {
  id: string;
  name: string;
  percentComplete: number;
  percentCorrect: number | null;
  hasActiveSession: boolean;
}

export const CategoryPracticeTable: React.FC = () => {
  const [categories, setCategories] = useState<CategoryPracticeDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/practice/categories")
      .then(res => {
        if (!res.ok) throw new Error("API not ready");
        return res.json();
      })
      .then((result: CategoryPracticeDTO[]) => {
        setCategories(result);
        setLoading(false);
      })
      .catch(() => {
        // ==================================
        // TEMP MOCK DATA (REMOVE LATER)
        // ==================================
        setCategories([
          {
            id: "d1-isa-process",
            name: "Information System Auditing Process",
            percentComplete: 0,
            percentCorrect: null,
            hasActiveSession: false,
          },
          {
            id: "d2-gov-it",
            name: "Governance and Management of IT",
            percentComplete: 0,
            percentCorrect: null,
            hasActiveSession: false,
          },
          {
            id: "d3-ops-resilience",
            name: "Information Systems Operations and Business Resilience",
            percentComplete: 0,
            percentCorrect: null,
            hasActiveSession: false,
          },
          {
            id: "d4-info-assets",
            name: "Protection of Information Assets",
            percentComplete: 0,
            percentCorrect: null,
            hasActiveSession: false,
          },
          {
            id: "d5-acq-dev",
            name: "Information Systems Acquisition, Development, and Implementation",
            percentComplete: 0,
            percentCorrect: null,
            hasActiveSession: false,
          },
        ]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="category-practice">
        <h2>Category Practice</h2>
        <p>Loading categories…</p>
      </section>
    );
  }

  return (
    <section className="category-practice">
      <h2>Category Practice</h2>

      <table className="practice-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Complete</th>
            <th>% Correct</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {categories.map(cat => {
            const actionLabel = cat.hasActiveSession
              ? "Resume"
              : cat.percentComplete === 0
              ? "Start"
              : "Reset";

            return (
              <tr key={cat.id}>
                <td>{cat.name}</td>
                <td>{cat.percentComplete}%</td>
                <td>
                  {cat.percentCorrect === null
                    ? "—"
                    : `${cat.percentCorrect}%`}
                </td>
                <td className="action-cell">
                  <button
                    className="practice-action-btn"
                    onClick={() => {
                      fetch("/practice/session", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          categoryId: cat.id,
                        }),
                      })
                        .then(res => {
                          if (!res.ok) throw new Error("API not ready");
                          return res.json();
                        })
                        .then(({ sessionId }) => {
                          window.location.href = `/practice/session/${sessionId}`;
                        })
                        .catch(() => {
                          // ==================================
                          // TEMP MOCK SESSION (REMOVE LATER)
                          // ==================================
                          const mockSessionId = `mock-${cat.id}`;
                          window.location.href = `/practice/session/${mockSessionId}`;
                        });
                    }}
                  >
                    {actionLabel}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
};
