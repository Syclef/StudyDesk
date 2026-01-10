import { QUESTIONS } from "../data/practice/index"; 
import { StudySession } from "../data/studySessions"; 

export const calculateStudyMetrics = (sessions: StudySession[], targetExamDate: string) => {
  // 1. Calculate Days Remaining
  const now = new Date();
  const exam = new Date(targetExamDate);
  const diffTime = exam.getTime() - now.getTime();
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // 2. Calculate Progress (Questions Attempted vs Total)
  const totalQuestions = QUESTIONS.length;
  
  // Explicitly typing 'r' to fix the error
  const attemptedQuestionIds = new Set(
    sessions.flatMap(s => s.responses?.map((r: { questionId: string }) => r.questionId) || [])
  );
  
  const progressPercent = totalQuestions > 0 
    ? Math.round((attemptedQuestionIds.size / totalQuestions) * 100) 
    : 0;

  // 3. Calculate ReadySCORE (Weighted Accuracy)
  const totalCorrect = sessions.reduce((acc, s) => acc + (s.correctCount || 0), 0);
  const totalAttempted = sessions.reduce((acc, s) => acc + (s.attemptedCount || 0), 0);
  const accuracy = totalAttempted > 0 ? (totalCorrect / totalAttempted) : 0;
  
  // Formula: 70% accuracy weight, 30% completion weight
  const readyScore = Math.round((accuracy * 70) + (progressPercent * 0.3));

  // 4. Calculate Daily Target
  const remainingQuestions = totalQuestions - attemptedQuestionIds.size;
  const dailyTarget = daysLeft > 0 
    ? Math.ceil(remainingQuestions / daysLeft) 
    : remainingQuestions;

  return {
    daysLeft: daysLeft > 0 ? daysLeft : 0,
    progressPercent,
    readyScore: Math.min(readyScore, 100),
    dailyTarget: dailyTarget > 0 ? dailyTarget : 0,
    accuracy: Math.round(accuracy * 100),
    totalAttempted,
    totalQuestions
  };
};