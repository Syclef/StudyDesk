import { z } from "zod";

const EnvSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),

  // DB
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  // We'll add auth later, but we prepare now:
  JWT_SECRET: z.string().min(16).optional(),
});

export type Env = z.infer<typeof EnvSchema>;

export const env: Env = (() => {
  const parsed = EnvSchema.safeParse(process.env);

  if (!parsed.success) {
    const formatted = parsed.error.format();

    console.error("❌ Invalid environment variables:");
    console.error(JSON.stringify(formatted, null, 2));
    console.error(
      "\nFix your api/.env file. Example:\n" +
        'DATABASE_URL="postgresql://user:pass@localhost:5432/db"\n' +
        "PORT=4000\n"
    );

    // Fail fast (prevents weird runtime crashes later)
    process.exit(1);
  }

  return parsed.data;
})();
