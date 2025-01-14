import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "^/(users|availability|attendee)": "http://localhost:8000/api/v1", // match each route with same baseURL
      /* Below is the alternate approach */
      // "/users": "http://localhost:8000/api/v1",
      // "/availability": "http://localhost:8000/api/v1",
      // "/attendee": "http://localhost:8000/api/v1",
    },
  },
  plugins: [react()],
  build: {
    modulePreload: true,
    target: "esnext",
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
