import { QUESTIONS } from "../data/practice/index"; 
import { StudySession } from "../data/studySessions"; 

// 1. Define the Interface to fix the TypeScript 'Property does not exist' error
export interface StudyMetrics {
  daysLeft: number;
  progressPercent: number;
  readyScore: number;
  dailyTarget: number;
  accuracy: number;
  totalAttempted: number;
  totalQuestions: number;
  streak: number;
}

export const calculateStudyMetrics = (sessions: StudySession[], targetExamDate: string): StudyMetrics => {
  // --- 1. Calculate Days Remaining ---
  const now = new Date();
  const exam = new Date(targetExamDate);
  const diffTime = exam.getTime() - now.getTime();
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // --- 2. Calculate Progress ---
  const totalQuestions = QUESTIONS.length;
  
  const attemptedQuestionIds = new Set(
    sessions.flatMap(s => s.responses?.map((r: { questionId: string }) => r.questionId) || [])
  );
  
  const progressPercent = totalQuestions > 0 
    ? Math.round((attemptedQuestionIds.size / totalQuestions) * 100) 
    : 0;

  // --- 3. Calculate ReadySCORE (Weighted Accuracy) ---
  const totalCorrect = sessions.reduce((acc, s) => acc + (s.correctCount || 0), 0);
  const totalAttempted = sessions.reduce((acc, s) => acc + (s.attemptedCount || 0), 0);
  const accuracy = totalAttempted > 0 ? (totalCorrect / totalAttempted) : 0;
  
  const readyScore = Math.round((accuracy * 70) + (progressPercent * 0.3));

  // --- 4. Calculate Daily Target ---
  const remainingQuestions = totalQuestions - attemptedQuestionIds.size;
  const dailyTarget = daysLeft > 0 
    ? Math.ceil(remainingQuestions / daysLeft) 
    : remainingQuestions;

  // --- 5. Calculate Current Streak (New Logic) ---
  const calculateStreak = (sessions: StudySession[]): number => {
    if (sessions.length === 0) return 0;

    // Get unique dates of study, sorted most recent first
    const dates = sessions
      .map(s => new Date(s.startTime).toDateString())
      .filter((value, index, self) => self.indexOf(value) === index)
      .map(d => new Date(d))
      .sort((a, b) => b.getTime() - a.getTime());

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if the user studied today or yesterday to keep streak alive
    const latestStudyDate = dates[0];
    latestStudyDate.setHours(0, 0, 0, 0);
    
    const diffDays = Math.floor((today.getTime() - latestStudyDate.getTime()) / (1000 * 3600 * 24));
    
    if (diffDays <= 1) {
      streak = 1;
      for (let i = 0; i < dates.length - 1; i++) {
        const current = dates[i];
        const next = dates[i + 1];
        const diff = (current.getTime() - next.getTime()) / (1000 * 3600 * 24);
        
        if (diff === 1) {
          streak++;
        } else {
          break;
        }
      }
    }
    return streak;
  };

  return {
    daysLeft: daysLeft > 0 ? daysLeft : 0,
    progressPercent,
    readyScore: Math.min(readyScore, 100),
    dailyTarget: dailyTarget > 0 ? dailyTarget : 0,
    accuracy: Math.round(accuracy * 100),
    totalAttempted,
    totalQuestions,
    streak: calculateStreak(sessions) || 0 // Added to return object
  };
};