import type { FastifyInstance } from "fastify";
import { Domain } from "@prisma/client";
import { prisma } from "../lib/prisma.js";

const DOMAIN_VALUES = new Set<string>(Object.values(Domain));

export async function questionsRoutes(app: FastifyInstance) {
  app.get<{ Querystring: { category?: string; domain?: string } }>(
    "/questions",
    async (request, reply) => {
      const { category, domain } = request.query;

      if (domain && !DOMAIN_VALUES.has(domain)) {
        return reply.badRequest(`Invalid domain "${domain}"`);
      }

      const questions = await prisma.question.findMany({
        where: {
          active: true,
          ...(category ? { category } : {}),
          ...(domain ? { domain: domain as Domain } : {}),
        },
        include: {
          choices: {
            orderBy: { label: "asc" },
          },
        },
      });

      return questions;
    }
  );

  app.get("/categories", async () => {
    const rows = await prisma.question.groupBy({
      by: ["domain", "category"],
      where: { active: true },
      _count: { _all: true },
      orderBy: [{ domain: "asc" }, { category: "asc" }],
    });

    const byDomain = new Map<string, { name: string; count: number }[]>();
    for (const row of rows) {
      const list = byDomain.get(row.domain) ?? [];
      list.push({ name: row.category, count: row._count._all });
      byDomain.set(row.domain, list);
    }

    return Array.from(byDomain.entries()).map(([domain, categories]) => ({
      domain,
      categories,
    }));
  });
}
