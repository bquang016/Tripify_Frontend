import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname = typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8386',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(dirname, './src'),
    },
    // ✅ THÊM ĐOẠN NÀY: Ép buộc sử dụng React từ root node_modules
    dedupe: ['react', 'react-dom'], 
  },
  define: {
    global: "window",
  },
});