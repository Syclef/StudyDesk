import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import QuestionEngine from "../../components/questions/QuestionEngine";
import { QUESTIONS } from "../../data/questions";
import "../../styles/study-session.css";

export default function StudySessionPage() {
  const navigate = useNavigate();
  const { task } = useParams<{ task: string }>();

  const filteredQuestions = useMemo(() => {
    if (!task) {
      console.log("❌ StudySession: task param is undefined");
      return [];
    }

    const decoded = decodeURIComponent(task);
    console.log("🔎 StudySession: decoded task =", decoded);

    // Try domain match first
    const domainQuestions = QUESTIONS.filter(
      (q) => q.domain === decoded
    );

    if (domainQuestions.length > 0) {
      console.log(
        "✅ Domain match:",
        decoded,
        domainQuestions.length
      );
      return domainQuestions;
    }

    // Fallback to category (knowledge statement)
    const categoryQuestions = QUESTIONS.filter(
      (q) => q.category === decoded
    );

    console.log(
      "ℹ️ Category match:",
      decoded,
      categoryQuestions.length
    );

    return categoryQuestions;
  }, [task]);

  if (filteredQuestions.length === 0) {
    console.log(
      "⚠️ StudySession: no questions after filtering"
    );

    return (
      <div className="study-session-empty">
        <h2>No questions found</h2>
        <p>
          Study mode delivers exam-style questions.
          This task currently has no mapped questions.
        </p>
        <button onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    );
  }

  return (
    <QuestionEngine
      questions={filteredQuestions}
      mode="study"
      onComplete={() => navigate(-1)}
    />
  );
}
