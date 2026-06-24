import { defineConfig } from 'vite';

export default defineConfig({
  base: '/BIOVERSE/',
  server: {
    port: 3000,
    open: true
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    sourcemap: true
  }
});
