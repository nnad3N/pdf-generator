import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";

export default defineConfig({
  test: {
    alias: {
      "@/": new URL("./src/", import.meta.url).pathname,
    },
    environment: "jsdom",
    globals: true,
    setupFiles: "./tests/setup.ts",
  },
  plugins: [react(), tsconfigPaths()],
});
