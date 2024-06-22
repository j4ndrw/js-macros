import { defineConfig } from "vite";
import path from "node:path";
import babel from "vite-plugin-babel";
import { ViteMacroPlugin } from "../dist";
import { example$ } from "./macros/example/implementation";
import { square$ } from "./macros/square/implementation";

export default defineConfig({
  plugins: [ViteMacroPlugin({ macros: { example$, square$ } }), babel()],
  build: {
    lib: {
      entry: path.resolve(__dirname, "index.ts"),
      name: "index",
      formats: ["es"],
      fileName: `index`,
    },
  },
});
