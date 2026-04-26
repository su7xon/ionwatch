import path from "path"
import react from "@vitejs/plugin-react"
import basicSsl from '@vitejs/plugin-basic-ssl'
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), basicSsl()],
  server: {
    host: true,        // Expose to network (phone access ke liye)
    port: 5173,
    https: true,       // SSL for sensor permissions
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
