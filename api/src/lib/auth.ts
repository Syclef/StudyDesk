import argon2 from "argon2";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

// OWASP Password Storage Cheat Sheet (2024+) recommends Argon2id as the
// default for new applications — it's memory-hard, which is what actually
// defeats large-scale GPU/ASIC cracking (bcrypt's fixed ~4KB memory
// footprint doesn't). bcryptjs was in package.json but never actually used
// anywhere in this codebase — replaced outright rather than migrated.
//
// Config below matches OWASP's "standard web application" recommendation:
// https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
const ARGON2_OPTIONS = {
  type: argon2.argon2id,
  memoryCost: 46 * 1024, // 46 MiB
  timeCost: 2,
  parallelism: 1,
};

export async function hashPassword(plain: string): Promise<string> {
  return argon2.hash(plain, ARGON2_OPTIONS);
}

export async function verifyPassword(hash: string, plain: string): Promise<boolean> {
  try {
    return await argon2.verify(hash, plain);
  } catch {
    // argon2.verify throws on a malformed/foreign hash rather than
    // returning false — treat that the same as "wrong password" rather
    // than letting it surface as a 500.
    return false;
  }
}

// NIST 800-63B / OWASP guidance: enforce a real minimum length, not
// composition rules (no forced "must contain a symbol" — that pushes
// people toward predictable patterns like "Password1!", not stronger ones).
export function isPasswordAcceptable(plain: string): boolean {
  return typeof plain === "string" && plain.length >= 12;
}

declare module "fastify" {
  interface FastifyRequest {
    userId?: string;
  }
}

const COOKIE_NAME = "studydesk_session";

export function signSession(app: FastifyInstance, userId: string): string {
  return app.jwt.sign({ userId }, { expiresIn: "30d" });
}

export function setSessionCookie(reply: FastifyReply, token: string) {
  reply.setCookie(COOKIE_NAME, token, {
    httpOnly: true, // not readable by JS — survives an XSS bug elsewhere in the app
    secure: process.env.NODE_ENV === "production", // HTTPS-only once deployed; allows http on localhost dev
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days, matches JWT expiry above
  });
}

export function clearSessionCookie(reply: FastifyReply) {
  reply.clearCookie(COOKIE_NAME, { path: "/" });
}

// preHandler hook: reads the session cookie, verifies the JWT, and attaches
// the authenticated user's id to the request. Any route that needs a real
// per-user identity (i.e. almost everything except /health and /auth/login)
// should register this.
export async function requireAuth(req: FastifyRequest, reply: FastifyReply) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return reply.unauthorized("Not logged in");

  try {
    const payload = req.server.jwt.verify<{ userId: string }>(token);
    req.userId = payload.userId;
  } catch {
    return reply.unauthorized("Invalid or expired session");
  }
}
