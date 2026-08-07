/**
 * create-user.ts
 * ===============
 * Creates a user account. There's no public /register endpoint — this is a
 * closed group, so accounts are provisioned by whoever administers the app,
 * not by anyone who can reach the API.
 *
 * Usage:
 *   npx tsx scripts/create-user.ts <email> <password> [displayName]
 *
 * Example:
 *   npx tsx scripts/create-user.ts alice@example.com "a genuinely long passphrase" Alice
 *
 * Password requirement: 12+ characters minimum (length, not composition
 * rules — see api/src/lib/auth.ts for why). Passphrases work well here:
 * "correct horse battery staple" style is both easier to remember and
 * harder to crack than "P@ssw0rd1".
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { hashPassword, isPasswordAcceptable } from "../src/lib/auth.js";

const prisma = new PrismaClient();

async function main() {
  const [, , email, password, displayName] = process.argv;

  if (!email || !password) {
    console.error("Usage: npx tsx scripts/create-user.ts <email> <password> [displayName]");
    process.exit(1);
  }

  if (!isPasswordAcceptable(password)) {
    console.error("❌ Password must be at least 12 characters.");
    process.exit(1);
  }

  const normalizedEmail = email.toLowerCase().trim();

  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    console.error(`❌ A user with email "${normalizedEmail}" already exists.`);
    process.exit(1);
  }

  const hashed = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      email: normalizedEmail,
      password: hashed,
      displayName: displayName ?? null,
    },
  });

  console.log(`✅ Created user: ${user.email} (id: ${user.id})`);
}

main()
  .catch((err) => {
    console.error("❌ Failed to create user:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
