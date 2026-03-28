import React from "react";

interface PracticeMetricsProps {
  percentCorrect: number;
  questionsTaken: number;
  avgAnswerTime: string;
  avgCorrectTime: string;
  avgIncorrectTime: string;
  avgSessionDuration: string;
}

export const PracticeMetrics: React.FC<PracticeMetricsProps> = ({
  percentCorrect,
  questionsTaken,
  avgAnswerTime,
  avgCorrectTime,
  avgIncorrectTime,
  avgSessionDuration,
}) => {
  const hasData = questionsTaken > 0;

  return (
    <div className="practice-metrics-bar">
      <div className="metric-block">
        <strong>{hasData ? `${percentCorrect}%` : "—"}</strong>
        <span>Correct</span>
      </div>

      <div className="metric-block">
        <strong>{questionsTaken}</strong>
        <span>Questions Taken</span>
      </div>

      <div className="metric-block">
        <strong>{hasData ? avgAnswerTime : "—"}</strong>
        <span>Avg Answer Time</span>
      </div>

      <div className="metric-block">
        <strong>{hasData ? avgCorrectTime : "—"}</strong>
        <span>Avg Correct Time</span>
      </div>

      <div className="metric-block">
        <strong>{hasData ? avgIncorrectTime : "—"}</strong>
        <span>Avg Incorrect Time</span>
      </div>

      <div className="metric-block">
        <strong>{hasData ? avgSessionDuration : "—"}</strong>
        <span>Avg Session Duration</span>
      </div>
    </div>
  );
};
