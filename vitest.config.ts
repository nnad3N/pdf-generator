import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  test: {
    alias: {
      "@/": new URL("./src/", import.meta.url).pathname,
    },
    environment: "jsdom",
  },
  plugins: [tsconfigPaths()],
});
