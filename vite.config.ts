import build from "@hono/vite-build/cloudflare-workers";
import devServer from "@hono/vite-dev-server";
import cloudflareAdapter from "@hono/vite-dev-server/cloudflare";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
  console.log(mode);
  if (mode === "client") {
    return {
      esbuild: {
        jsxImportSource: "hono/jsx/dom",
      },
      build: {
        rollupOptions: {
          input: "./src/client/index.tsx",
          output: {
            entryFileNames: "assets/[name]-[hash].js",
          },
        },
        outDir: "./public",
        copyPublicDir: true,
        emptyOutDir: true,
        manifest: true,
      },
      publicDir: "./src/public",
    };
  }

  const entry = "./src/index.ts";
  return {
    server: { port: 8787 },
    plugins: [
      devServer({ adapter: cloudflareAdapter, entry }),
      build({ entry }),
    ],
  };
});