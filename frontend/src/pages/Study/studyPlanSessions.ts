import { QUESTIONS } from "../../data/questions";
import { PracticeQuestion, ChoiceLetter } from "../../data/practice/types";

/* ===============================
   TYPES
   =============================== */

interface StudyAnswer {
  questionId: string;
  selected: ChoiceLetter;
  correct: boolean;
  timeSpentMs: number;
}

interface StudySession {
  id: string;
  category: string;
  index: number;
  questions: PracticeQuestion[];
  answers: StudyAnswer[];
}

/* ===============================
   IN-MEMORY STORE
   =============================== */

const sessions = new Map<string, StudySession>();

/* ===============================
   SESSION API
   =============================== */

export function startStudySession(category: string): string {
  const sessionId = crypto.randomUUID();

  const taskQuestions = QUESTIONS.filter(
    (q) => q.category === category
  );

  sessions.set(sessionId, {
    id: sessionId,
    category,
    index: 0,
    questions: taskQuestions,
    answers: [],
  });

  return sessionId;
}

export function getNextStudyQuestion(sessionId: string) {
  const session = sessions.get(sessionId);
  if (!session) return null;

  const q = session.questions[session.index];
  if (!q) return null;

  return {
    id: q.id,
    question: q.question,
    choices: q.choices,
    index: session.index + 1,
    total: session.questions.length,
  };
}

export function submitStudyAnswer(
  sessionId: string,
  questionId: string,
  selected: ChoiceLetter,
  timeSpentMs: number
) {
  const session = sessions.get(sessionId);
  if (!session) return;

  const q = session.questions[session.index];
  if (!q || q.id !== questionId) return;

  session.answers.push({
    questionId,
    selected,
    correct: selected === q.correctAnswer,
    timeSpentMs,
  });

  session.index++;
}

export function finishStudySession(sessionId: string) {
  const session = sessions.get(sessionId);
  if (!session) return null;

  const total = session.answers.length;
  const correct = session.answers.filter((a) => a.correct).length;

  return {
    category: session.category,
    totalQuestions: total,
    correct,
    percentCorrect:
      total === 0 ? 0 : Math.round((correct / total) * 100),
    avgTimeMs:
      total === 0
        ? 0
        : Math.round(
            session.answers.reduce(
              (sum, a) => sum + a.timeSpentMs,
              0
            ) / total
          ),
    questions: session.questions,
    answers: session.answers,
  };
}
