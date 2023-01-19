import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./src"],
  splitting: false,
  clean: true,
  outDir: "./dist/",
});
