// src/data/questions.ts

import { PracticeQuestion } from "./practice/types";

// Domain imports
import { domain1Questions } from "./practice/domain1";
// later:
// import { domain2Questions } from "./practice/domain2";

export const QUESTIONS: PracticeQuestion[] = [
  ...domain1Questions,
  // ...domain2Questions,
];
