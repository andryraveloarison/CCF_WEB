import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { registerSW } from 'virtual:pwa-register';
registerSW(); // Pour activer le service worker

// Mises à jour OTA (app Android) — marche hors-ligne, se met à jour si réseau
import { initLiveUpdates } from './services/update/LiveUpdate';
initLiveUpdates();


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);