const API_BASE_URL = "http://127.0.0.1:8000";
export interface Question {
  id: number;
  domain: number;
  topic: string;
  question: string;
  choices: Record<string, string>;
  correct_answer: string;
  explanation: string;
  difficulty: string;
}

export async function fetchQuestions(): Promise<Question[]> {
  const response = await fetch(`${API_BASE_URL}/questions`);

  if (!response.ok) {
    throw new Error("Failed to fetch questions");
  }
  return response.json();
}
