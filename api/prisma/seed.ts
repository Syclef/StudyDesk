/**
 * seed.ts
 * Run with: npm run db:seed
 */

import { PrismaClient, Domain } from "@prisma/client";
import { createRequire } from "module";
import bcrypt from "bcryptjs";

const require = createRequire(import.meta.url);
const prisma = new PrismaClient();

// ─── Data sources ─────────────────────────────────────────────────────────────

const flashcards: Array<{ id: number; term: string; definition: string }> =
  require("../data/flashcards.json");

type RawChoice = {
  label: string;
  text: string;
  isCorrect: boolean;
  justification: string;
};

type RawQuestion = {
  externalId: string;
  text: string;
  taskId: string;
  taskStatement: string;
  choices: RawChoice[];
};

type RawGroup = {
  code: string;
  domain: string;
  category: string;
  questions: RawQuestion[];
};

const questionGroups: RawGroup[] = require("../data/questions.json");

// ─── Domain mapping ───────────────────────────────────────────────────────────

function toDomainEnum(code: string): Domain {
  const map: Record<string, Domain> = {
    D1: Domain.D1,
    D2: Domain.D2,
    D3: Domain.D3,
    D4: Domain.D4,
    D5: Domain.D5,
  };
  return map[code] ?? Domain.D1;
}

// ─── Seed dev user ────────────────────────────────────────────────────────────

async function seedDevUser() {
  const email = "dev@local.test";
  const password = await bcrypt.hash("password123", 10);
  await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, password },
  });
  console.log("✅ Dev user done");
}

// ─── Seed flashcards ──────────────────────────────────────────────────────────

async function seedFlashcards() {
  console.log(`Seeding ${flashcards.length} flashcards...`);
  for (const card of flashcards) {
    await prisma.flashcard.upsert({
      where: { id: card.id },
      update: { term: card.term, definition: card.definition },
      create: { id: card.id, term: card.term, definition: card.definition },
    });
  }
  console.log("✅ Flashcards done");
}

// ─── Seed questions ───────────────────────────────────────────────────────────

async function seedQuestions() {
  const total = questionGroups.reduce((sum, g) => sum + g.questions.length, 0);
  console.log(`Seeding ${total} questions across ${questionGroups.length} categories...`);

  let count = 0;

  for (const group of questionGroups) {
    const domain = toDomainEnum(group.code);

    for (const q of group.questions) {
      await prisma.question.upsert({
        where: { legacyId: q.externalId },
        update: {
          domain,
          category: group.category,
          text: q.text,
          taskId: q.taskId ?? null,
          taskStatement: q.taskStatement ?? null,
          choices: {
            deleteMany: {},
            create: q.choices.map((c) => ({
              label: c.label,
              text: c.text ?? "",
              isCorrect: c.isCorrect,
              justification: c.justification ?? null,
            })),
          },
        },
        create: {
          legacyId: q.externalId,
          domain,
          category: group.category,
          text: q.text,
          taskId: q.taskId ?? null,
          taskStatement: q.taskStatement ?? null,
          choices: {
            create: q.choices.map((c) => ({
              label: c.label,
              text: c.text ?? "",
              isCorrect: c.isCorrect,
              justification: c.justification ?? null,
            })),
          },
        },
      });

      count++;
      if (count % 100 === 0) {
        console.log(`  ${count}/${total} questions seeded...`);
      }
    }
  }

  console.log(`✅ Questions done (${count} total)`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Starting seed...\n");

  await seedDevUser();
  await seedFlashcards();
  await seedQuestions();

  console.log("\n🎉 Seed complete");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
