import { defineConfig } from "vite";

const apiProxy = {
  "/api": "http://localhost:3001",
  "/uploads": "http://localhost:3001",
};

export default defineConfig({
  server: {
    port: 5173,
    strictPort: true,
    proxy: apiProxy,
  },
  preview: {
    port: 5173,
    strictPort: true,
    proxy: apiProxy,
  },
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        admin: "admin/index.html",
      },
    },
  },
});
