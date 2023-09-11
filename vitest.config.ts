import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
import { join } from "path";

export default defineConfig({
  test: {
    alias: {
      "@/": join(__dirname, "./src/"),
    },
    environment: "jsdom",
  },
  plugins: [tsconfigPaths()],
});
