/// <reference types="vite/client" />
// src/vite-env.d.ts

declare module 'virtual:pwa-register' {
    export type RegisterSWOptions = {
      immediate?: boolean;
      onNeedRefresh?: () => void; 
      onOfflineReady?: () => void;
      onRegisteredSW?: (
        swScriptUrl: string,
        registration: ServiceWorkerRegistration
      ) => void;
      onRegisterError?: (error: any) => void;
    };
  
    export function registerSW(options?: RegisterSWOptions): (reloadPage?: boolean) => void;
  }
  