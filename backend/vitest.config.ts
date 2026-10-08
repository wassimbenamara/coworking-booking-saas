import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    include: ["src/**/*.test.ts"],

    // Integration tests share the same PostgreSQL test database.
    fileParallelism: false,

    env: {
      NODE_ENV: "test",
    },
  },
});
