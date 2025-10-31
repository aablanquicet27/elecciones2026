import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Asegura que las rutas sean absolutas desde la raíz
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // Desactiva sourcemaps en producción para reducir tamaño
    rollupOptions: {
      output: {
        manualChunks: undefined,
        // Nombres consistentes para archivos de assets
        assetFileNames: 'assets/[name].[hash].[ext]',
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js',
      },
    },
  },
  optimizeDeps: {
    include: ['@capacitor/core', '@capacitor/app', '@capacitor/status-bar', '@capacitor/splash-screen']
  }
});
