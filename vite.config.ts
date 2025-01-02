import { defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), visualizer()],
  server: {
    proxy: {
      "/api-stillness": {
        target: "https://eve.beaukode.net/",
        changeOrigin: true,
      },
    },
  },
  build: {
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
        },
      },
    },
  },
});
