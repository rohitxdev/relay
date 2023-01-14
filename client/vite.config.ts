import { defineConfig } from "vite";
import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import postcssPresetEnv from "postcss-preset-env";
import { Plugin } from "postcss";

export default defineConfig(({ mode }) => ({
  build: {
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      input: {
        index: "./index.html",
        "service-worker": "./src/service-worker/service-worker.ts",
      },
      output: {
        entryFileNames: (chunkInfo) => (chunkInfo.name === "service-worker" ? "[name].js" : "assets/[name].[hash].js"),
      },
    },
  },
  css: {
    modules: {
      localsConvention: "camelCase",
      generateScopedName: mode === "development" ? "[name]__[local]" : "[hash:base64:8]",
    },
    postcss: {
      plugins: [postcssPresetEnv({ stage: 1 }) as Plugin],
    },
  },
  publicDir: "./src/public/",
  plugins: [react(), svgr({ exportAsDefault: true })],
  resolve: {
    alias: {
      "@assets": resolve(__dirname, "./src/assets"),
      "@components": resolve(__dirname, "./src/components"),
      "@context": resolve(__dirname, "./src/context"),
      "@hooks": resolve(__dirname, "./src/hooks"),
      "@helpers": resolve(__dirname, "./src/helpers"),
      "@pages": resolve(__dirname, "./src/pages"),
    },
  },
  server: {
    host: true,
    port: 3000,
    proxy: {
      "/api": {
        target: "http://0.0.0.0",
        changeOrigin: true,
      },
      "/socket.io": {
        target: "ws://0.0.0.0",
        changeOrigin: true,
      },
    },
  },
}));
