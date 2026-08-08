import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  },
  server: {
    // Cache-Control: no-store on every response is a stronger, root-cause
    // defense against the browser back-button/bfcache exposure issue than
    // reacting to it in AuthContext alone — a page served with no-store is
    // generally excluded from bfcache eligibility in the first place,
    // rather than being cached and then hard-reloaded after the fact.
    // TODO: the equivalent needs to be set on whatever production host
    // this ends up on (e.g. a vercel.json headers rule) — this only
    // covers the Vite dev server.
    headers: {
      "Cache-Control": "no-store",
    },
    proxy: {
      "/flashcards": {
        target: "http://127.0.0.1:4000",
        changeOrigin: true
      }
    }
  }
});
