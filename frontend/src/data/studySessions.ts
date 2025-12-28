import { QUESTIONS, Question } from "./questions";

interface StudySession {
  id: string;
  taskId: string;
  index: number;
  questions: Question[];
}

const sessions = new Map<string, StudySession>();

export function startStudySession(taskId: string) {
  const sessionId = crypto.randomUUID();

  const taskQuestions = QUESTIONS.filter(q => q.taskId === taskId);

  sessions.set(sessionId, {
    id: sessionId,
    taskId,
    index: 0,
    questions: taskQuestions,
  });

  return sessionId;
}

export function getNextQuestion(sessionId: string) {
  const session = sessions.get(sessionId);
  if (!session) return null;

  const q = session.questions[session.index];
  session.index++;

  return {
    id: q.id,
    index: session.index,
    total: session.questions.length,
    stem: q.stem,
    choices: q.choices,
  };
}
