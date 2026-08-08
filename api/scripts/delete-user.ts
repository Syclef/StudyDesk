/**
 * delete-user.ts
 * ===============
 * Removes a user account by email — for cleaning up typos or accounts
 * that shouldn't exist. Deletes their attempts/answers too (cascades via
 * the schema's onDelete: Cascade on Attempt.userId), so this is a real
 * deletion, not reversible.
 *
 * Usage:
 *   npx tsx scripts/delete-user.ts <email>
 *
 * Example:
 *   npx tsx scripts/delete-user.ts workitao@gmail..com
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const [, , email] = process.argv;

  if (!email) {
    console.error("Usage: npx tsx scripts/delete-user.ts <email>");
    process.exit(1);
  }

  const normalizedEmail = email.toLowerCase().trim();

  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (!user) {
    console.error(`❌ No user found with email "${normalizedEmail}".`);
    process.exit(1);
  }

  await prisma.user.delete({ where: { id: user.id } });
  console.log(`✅ Deleted user: ${normalizedEmail} (id: ${user.id})`);
}

main()
  .catch((err) => {
    console.error("❌ Failed to delete user:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
