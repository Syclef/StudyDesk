import "dotenv/config";

import Fastify from "fastify";
import cors from "@fastify/cors";
import sensible from "@fastify/sensible";

import { env } from "./config/env.js";

const app = Fastify({ logger: true });

await app.register(cors, { origin: true });
await app.register(sensible);

app.get("/health", async () => ({ ok: true }));

app.listen({ port: env.PORT, host: "0.0.0.0" }).then(() => {
  app.log.info(`API running on http://localhost:${env.PORT}`);
});
