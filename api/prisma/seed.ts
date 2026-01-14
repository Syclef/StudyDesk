import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create a dev user for testing
  const email = "dev@local.test";
  const password = await bcrypt.hash("password123", 10);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, password },
  });

  console.log("✅ Seed complete: dev user created");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
