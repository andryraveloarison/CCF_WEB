import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import tailwindcss from '@tailwindcss/vite';

// 🧪 Sert /api/verse pendant `npm run dev` (la fonction Vercel n'existe qu'en prod).
// Même logique que api/verse.js via le noyau partagé api/_verseCore.js.
const verseDevApi = (env: Record<string, string>): Plugin => ({
  name: 'verse-dev-api',
  configureServer(server) {
    server.middlewares.use('/api/verse', (req, res, next) => {
      if (req.method !== 'POST') return next();
      let body = '';
      req.on('data', (chunk) => (body += chunk));
      req.on('end', async () => {
        try {
          const { verse } = JSON.parse(body || '{}');
          // @ts-expect-error — module JS sans déclaration de types
          const { suggestFromVerse } = await import('./api/_verseCore.js');
          const result = await suggestFromVerse(verse, env);
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(result));
        } catch (e: any) {
          res.statusCode = e?.status || 502;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: e?.message || 'Erreur IA.' }));
        }
      });
    });
  },
});

export default defineConfig(({ mode }) => {
  // Charge TOUTES les variables de .env (y compris sans préfixe VITE_)
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      verseDevApi(env),
      VitePWA({
        registerType: 'autoUpdate',
        devOptions: {
          enabled: true,
        },
        includeAssets: [
          'icon.png',
          'icons/icon-192.png',
          'icons/icon-512.png',
          'logo.png',
        ],
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
        workbox: {
          navigateFallbackDenylist: [/^\/releases\//, /^\/api\//],
          runtimeCaching: [
            {
              // 🔒 Match l’API sur Render
              urlPattern: /^https:\/\/hayback\.onrender\.com\/api\/song\/getAll$/,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'hayback-songs-cache',
                networkTimeoutSeconds: 3,
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24 * 7, // 7 jours
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
      }),
      tailwindcss(),
    ],
  };
});
