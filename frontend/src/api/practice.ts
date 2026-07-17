const API_BASE_URL = "http://127.0.0.1:4000";

export interface PracticeChoice {
  id: string;
  label: string;
  text: string;
  isCorrect: boolean;
  justification: string | null;
}

export interface PracticeQuestion {
  id: string;
  domain: string;
  category: string;
  text: string;
  explanation: string | null;
  taskStatement: string | null;
  choices: PracticeChoice[];
}

export interface CategorySummary {
  name: string;
  count: number;
}

export interface DomainCategories {
  domain: string;
  categories: CategorySummary[];
}

export async function fetchCategories(): Promise<DomainCategories[]> {
  const response = await fetch(`${API_BASE_URL}/categories`);
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }
  return response.json();
}

export async function fetchQuestionsByCategory(
  category: string
): Promise<PracticeQuestion[]> {
  const response = await fetch(
    `${API_BASE_URL}/questions?category=${encodeURIComponent(category)}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch questions");
  }
  return response.json();
}
