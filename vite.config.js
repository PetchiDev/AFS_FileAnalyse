import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';
import { fileURLToPath } from 'url';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    svgr(),
    nodePolyfills({
      // Polyfill Buffer and process — required by @kenjiuno/msgreader
      include: ['buffer', 'process'],
      globals: {
        Buffer: true,
        process: true,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  optimizeDeps: {
    include: [
      '@tanstack/react-router',
      '@tanstack/react-query',
      '@kenjiuno/msgreader'
    ]
  },
  server: {
    port: 3000,
    open: true
  }
});

