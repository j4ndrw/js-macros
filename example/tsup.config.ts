import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["index.ts"],
  dts: { only: true },
  outDir: "./dist",
});
