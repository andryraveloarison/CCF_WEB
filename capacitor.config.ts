import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'ccf',
  webDir: 'dist',
  plugins: {
    CapacitorUpdater: {
      // On gère les mises à jour nous-mêmes (voir src/services/update/LiveUpdate.ts)
      autoUpdate: false,
    },
  },
};

export default config;
