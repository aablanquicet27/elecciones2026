import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Generar hashes únicos para cache busting
    rollupOptions: {
      output: {
        // Agregar hash a los nombres de archivos para cache busting
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
        manualChunks: undefined,
      },
    },
    // Generar sourcemaps para debugging
    sourcemap: true,
  },
  optimizeDeps: {
    include: ['@capacitor/core', '@capacitor/app', '@capacitor/status-bar', '@capacitor/splash-screen']
  }
});
