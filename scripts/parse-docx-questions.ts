import fs from "fs";
import path from "path";
import mammoth from "mammoth";

type PracticeQuestion = {
  id: string;
  domain: string;
  category: string;
  question: string;
  choices: Record<string, string>;
  correctAnswer: string;
  justification: string;
};

const DOCX_PATH =
  "C:/Users/COA/Desktop/Domain 1 - Information System Auditing Process.docx";

const OUTPUT_PATH =
  "frontend/src/data/practice/domain1.ts";

async function parseDocx() {
  const result = await mammoth.extractRawText({ path: DOCX_PATH });
  const lines = result.value
    .split("\n")
    .map(l => l.trim())
    .filter(Boolean);

  const questions: PracticeQuestion[] = [];

  let currentQuestion = "";
  let choices: Record<string, string> = {};
  let correctAnswer = "";
  let justificationLines: string[] = [];
  let domain = "Domain 1 – Information System Auditing Process";
  let category = "";

  let inJustification = false;

  function flushQuestion() {
    if (!currentQuestion || !correctAnswer || Object.keys(choices).length !== 4) {
      return;
    }

    questions.push({
      id: `D1-${questions.length + 1}`,
      domain,
      category,
      question: currentQuestion,
      choices,
      correctAnswer,
      justification: justificationLines.join(" ").trim(),
    });

    currentQuestion = "";
    choices = {};
    correctAnswer = "";
    justificationLines = [];
    category = "";
    inJustification = false;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Question stem
    if (line.endsWith("?")) {
      flushQuestion();
      currentQuestion = line;
      continue;
    }

    // Choices
    if (/^[A-D]\./.test(line)) {
      const key = line[0];
      choices[key] = line.slice(2).trim();
      continue;
    }

    // Correct answer marker
    const correctMatch = line.match(/^([A-D]) is the correct answer/i);
    if (correctMatch) {
      correctAnswer = correctMatch[1];
      inJustification = true;
      continue;
    }

    // Domain / Category metadata
    if (line.startsWith("Domain")) {
      domain = line.replace(/^Domain\s*\d*\s*[-–]?\s*/i, "").trim();
      continue;
    }

    if (line.startsWith("Sub-domain")) {
      category = line.replace(/^Sub-domain\s*[-–]?\s*/i, "").trim();
      continue;
    }

    // Justification text
    if (inJustification) {
      justificationLines.push(line);
    }
  }

  flushQuestion();

  if (questions.length === 0) {
    throw new Error("Parser failed: NO QUESTIONS DETECTED");
  }

  const fileContent = `
import { PracticeQuestion } from "../types";

export const domain1Questions: PracticeQuestion[] = ${JSON.stringify(
    questions,
    null,
    2
  )};
`;

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, fileContent, "utf-8");

  console.log(`Domain 1 imported: ${questions.length} questions`);
}

parseDocx().catch(err => {
  console.error(err);
  process.exit(1);
});
