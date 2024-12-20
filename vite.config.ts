import { defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), visualizer()],
  server: {
    proxy: {
      "/api-stillness/solarsystems": {
        target: "https://blockchain-gateway-nova.nursery.reitnorf.com/",
        rewrite: (path) => path.replace(/^\/api-stillness/, ""),
        changeOrigin: true,
      },
      "/api-stillness": {
        target:
          "https://blockchain-gateway-stillness.live.tech.evefrontier.com/",
        rewrite: (path) => path.replace(/^\/api-stillness/, ""),
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
