import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "robots.txt", "apple-touch-icon.png"], // Add any additional assets you want to cache
      manifest: {
        name: "Clubliv marker next",
        short_name: "Clubliv",
        description: "SCORE.STREAM.SHARE",
        theme_color: "#ffffff",
        icons: [
          {
            src: "clubliv-icon.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "clubliv-icon.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "clubliv-icon.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});