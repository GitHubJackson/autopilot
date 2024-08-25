import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 指定路径别名
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  assetsInclude: ["**/*.glb"],
});
