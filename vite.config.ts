import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa'; // Corriger l'importation
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true, // Activer le Service Worker en mode développement
      },
      includeAssets: ['icon.png', 'icons/icon-192.png', 'icons/icon-512.png', 'data/songs.json', 'lyrics/*.txt'],
      manifest: {
        name: 'CCF',
        short_name: 'CCF',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#4a90e2',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
    tailwindcss(),
  ],
});