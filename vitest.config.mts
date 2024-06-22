import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'node',
    environment: 'node',
    include: [
      'test/**/*.{test,spec}.?(c|m)[jt]s?(x)',
      'test/**/*.node.{test,spec}.?(c|m)[jt]s?(x)',
    ],
    passWithNoTests: true,
  },
});
