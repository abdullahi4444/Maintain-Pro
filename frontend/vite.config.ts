import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
  },

  // Add this test section:
  test: {
    environment: "jsdom",        // browser-like environment
    globals: true,               // no need to import describe/test globally
    setupFiles: "./src/setupTests.ts", // optional: for extra matchers
  },
});
