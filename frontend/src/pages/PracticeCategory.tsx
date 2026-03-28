import { useParams, useNavigate } from "react-router-dom";
import "../styles/practice-category.css";
import { QUESTIONS } from "../data/questions";

export default function PracticeCategory() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();

  if (!category) return null;

  const decodedCategory = decodeURIComponent(category);

  const questions = QUESTIONS.filter(
    q => q.category.toLowerCase() === decodedCategory.toLowerCase()
  );

  const total = questions.length;
  const percentCorrect = 0;
  const avgTime = "—";
  const questionsTaken = 0;

  return (
    <div className="practice-category-dashboard">
      {/* HEADER */}
      <div className="practice-category-header">
        <h2>{decodedCategory}</h2>
        <button className="reset-btn">Reset</button>
      </div>

      {/* PROGRESS */}
      <div className="practice-category-progress">
        <div className="progress-label">
          {percentCorrect}% correct ({questionsTaken} of {total})
        </div>
        <div className="progress-bar">
          <div className="progress-fill progress-0" />
        </div>
      </div>

      {/* METRICS */}
      <div className="practice-category-metrics">
        <div className="metric-main">
          <div className="metric-main-value">{percentCorrect}%</div>
          <div className="metric-main-label">Correct</div>
        </div>

        <div className="metric-main">
          <div className="metric-main-value">{avgTime}</div>
          <div className="metric-main-label">Avg. answer time</div>
        </div>

        <div className="metric-main">
          <div className="metric-main-value">{questionsTaken}</div>
          <div className="metric-main-label">Questions taken</div>
        </div>
      </div>

      {/* DOMAIN HEADER */}
      <div className="domain-header">
        Information System Auditing Process
      </div>

      {/* CATEGORY TABLE */}
      <div className="category-table">
        <div className="category-table-header">
          <div>Category</div>
          <div>% Correct</div>
          <div>Questions</div>
        </div>

        <div
          className="category-table-row category-indent"
          onClick={() =>
            navigate(`/practice/session/${encodeURIComponent(decodedCategory)}`)
          }
        >
          <div className="category-link">{decodedCategory}</div>
          <div>0%</div>
          <div>{total}</div>
        </div>
      </div>
    </div>
  );
}
