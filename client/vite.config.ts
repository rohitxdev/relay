import { defineConfig } from "vite";
import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import postcssPresetEnv from "postcss-preset-env";
import { Plugin } from "postcss";
export default defineConfig(({ mode }) => ({
  plugins: [react(), svgr({ exportAsDefault: true, svgrOptions: { icon: true } })],
  css: {
    modules: {
      localsConvention: "camelCase",
      generateScopedName: mode === "development" ? "[local]__[hash:base64:4]" : "[hash:base64:6]",
    },
    postcss: {
      plugins: [postcssPresetEnv({ stage: 1 }) as Plugin],
    },
  },
  resolve: {
    alias: {
      "@assets": resolve(__dirname, "./src/assets"),
      "@components": resolve(__dirname, "./src/components"),
      "@context": resolve(__dirname, "./src/context"),
      "@pages": resolve(__dirname, "./src/pages"),
      "@store": resolve(__dirname, "./src/store"),
      "@utils": resolve(__dirname, "./src/utils"),
    },
  },
}));
