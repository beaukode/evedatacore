import { defineConfig } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { visualizer } from "rollup-plugin-visualizer";
import react from "@vitejs/plugin-react";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), visualizer()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api-stillness": {
        target: "https://evedataco.re/",
        changeOrigin: true,
      },
      "/static": {
        target: "https://main.eve.beaukode.net/",
        changeOrigin: true,
      },
      "/api": {
        target: process.env.USE_LOCAL_API
          ? "http://localhost:3000/"
          : "https://main.eve.beaukode.net/",
        changeOrigin: true,
      },
      "/api-v2": {
        target: process.env.USE_LOCAL_API
          ? "http://localhost:3000/"
          : "https://main.eve.beaukode.net/",
        changeOrigin: true,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router"],
          mui: [
            "@mui/material",
            "@mui/icons-material",
            "@emotion/react",
            "@emotion/styled",
            "react-virtuoso",
          ],
          web3: ["viem", "wagmi"],
          redux: [
            "redux",
            "react-redux",
            "redux-saga",
            "@reduxjs/toolkit",
            "typed-redux-saga",
          ],
        },
      },
    },
  },
});
