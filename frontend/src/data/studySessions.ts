import { QUESTIONS } from "./practice/index"; 
import { PracticeQuestion } from "./practice/types";

export interface StudySession {
  id: string;
  taskId: string;
  index: number;
  questions: PracticeQuestion[];
  startTime: string;
  endTime?: string;
  responses: Array<{
    questionId: string;
    selectedOption: string;
    isCorrect: boolean;
  }>;
  correctCount: number;
  attemptedCount: number;
}

const STORAGE_KEY = 'audits_study_sessions_v1';

// 1. Initialize sessions from LocalStorage so progress persists across refreshes
const loadSessions = (): Map<string, StudySession> => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return new Map<string, StudySession>();
  try {
    const parsed = JSON.parse(saved);
    return new Map<string, StudySession>(Object.entries(parsed));
  } catch (e) {
    console.error("Failed to load study sessions", e);
    return new Map<string, StudySession>();
  }
};

const sessions = loadSessions();

// 2. Helper to save state whenever data changes
const saveToDisk = () => {
  const data = Object.fromEntries(sessions);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export function startStudySession(taskId: string) {
  const sessionId = crypto.randomUUID();

  const taskQuestions = QUESTIONS.filter(
    q => q.taskId === taskId
  );

  sessions.set(sessionId, {
    id: sessionId,
    taskId,
    index: 0,
    questions: taskQuestions,
    startTime: new Date().toISOString(),
    responses: [],
    correctCount: 0,
    attemptedCount: 0,
  });

  saveToDisk();
  return sessionId;
}

export function recordResponse(sessionId: string, questionId: string, selectedOption: string, isCorrect: boolean) {
  const session = sessions.get(sessionId);
  if (!session) return;

  session.responses.push({ questionId, selectedOption, isCorrect });
  session.attemptedCount++;
  if (isCorrect) {
    session.correctCount++;
  }
  
  saveToDisk(); // Update storage immediately
}

export function getNextQuestion(sessionId: string) {
  const session = sessions.get(sessionId);
  if (!session) return null;

  const q = session.questions[session.index];
  if (!q) return null;

  session.index++;
  saveToDisk(); // Save current index progress

  return {
    id: q.id,
    index: session.index,
    total: session.questions.length,
    stem: q.question,
    choices: q.choices,
  };
}

export function getAllSessions(): StudySession[] {
  return Array.from(sessions.values());
}

/**
 * Utility to clear progress if you want to restart your study plan
 */
export function clearAllProgress() {
  sessions.clear();
  localStorage.removeItem(STORAGE_KEY);
  window.location.reload();
}