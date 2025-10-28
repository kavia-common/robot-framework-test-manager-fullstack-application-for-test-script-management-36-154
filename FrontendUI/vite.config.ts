import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@api": path.resolve(__dirname, "src/api"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@components": path.resolve(__dirname, "src/components"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@styles": path.resolve(__dirname, "src/styles")
    }
  },
  server: {
    host: true,
    port: 3000,
    strictPort: true,
    // Allow only the required preview host, do not broaden beyond necessity.
    allowedHosts: ["vscode-internal-35511-beta.beta01.cloud.kavia.ai"],
    hmr: {
      clientPort: 3000,
      overlay: true
    },
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true
      }
    }
  },
  preview: {
    host: true,
    port: 3000,
    strictPort: true,
    allowedHosts: ["vscode-internal-35511-beta.beta01.cloud.kavia.ai"]
  }
});
