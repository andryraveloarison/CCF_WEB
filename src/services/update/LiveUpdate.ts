import { Capacitor } from '@capacitor/core';
import { CapacitorUpdater } from '@capgo/capacitor-updater';

/**
 * Mises à jour OTA (Over-The-Air).
 *
 * Le site reste embarqué dans l'APK (donc l'app marche hors-ligne). Au
 * démarrage, si le téléphone a du réseau, on regarde s'il existe une version
 * plus récente sur le serveur : on la télécharge et on l'active au prochain
 * lancement. Hors-ligne, on garde simplement la version locale.
 *
 * UPDATE_BASE = URL publique du déploiement Vercel (là où le CI publie
 * version.json et bundle.zip), sans slash final.
 */
const UPDATE_BASE = 'https://ccf-web.vercel.app/releases';

export async function initLiveUpdates(): Promise<void> {
  // Indispensable : valide le bundle actif, sinon le plugin revient
  // automatiquement à la version précédente (sécurité anti-brique).
  try {
    await CapacitorUpdater.notifyAppReady();
  } catch {
    /* pas grave sur le web / premier lancement */
  }

  // Uniquement sur mobile natif — inutile sur le web / PWA.
  if (!Capacitor.isNativePlatform()) return;

  try {
    const res = await fetch(`${UPDATE_BASE}/version.json`, { cache: 'no-store' });
    if (!res.ok) return;

    const { version } = (await res.json()) as { version?: string };
    if (!version) return;

    const current = await CapacitorUpdater.current();
    if (current.bundle.version === version) return; // déjà à jour

    // Télécharge le nouveau site puis l'active au PROCHAIN démarrage
    const bundle = await CapacitorUpdater.download({
      url: `${UPDATE_BASE}/bundle.zip`,
      version,
    });
    await CapacitorUpdater.next(bundle);
  } catch (err) {
    // Hors-ligne ou erreur réseau : on conserve la version locale.
    console.log('Mise à jour OTA ignorée :', err);
  }
}

export type ManualUpdateResult = 'updated' | 'up-to-date' | 'web' | 'error';

/**
 * Mise à jour OTA MANUELLE (bouton « Actualiser »).
 *
 * Différence clé avec initLiveUpdates() : ici on applique la nouvelle version
 * IMMÉDIATEMENT via CapacitorUpdater.set() (qui recharge le webview sur le
 * nouveau bundle), au lieu de .next() qui n'active la MàJ qu'au prochain
 * lancement à froid — lancement que les utilisateurs font rarement sur Android.
 *
 * - 'web'         : pas en natif, au caller de recharger la page.
 * - 'up-to-date'  : déjà à la dernière version.
 * - 'updated'     : rarement renvoyé — set() recharge le webview avant le return.
 * - 'error'       : hors-ligne ou échec réseau.
 */
export async function checkForUpdateNow(): Promise<ManualUpdateResult> {
  if (!Capacitor.isNativePlatform()) return 'web';

  try {
    const res = await fetch(`${UPDATE_BASE}/version.json`, { cache: 'no-store' });
    if (!res.ok) return 'error';

    const { version } = (await res.json()) as { version?: string };
    if (!version) return 'error';

    const current = await CapacitorUpdater.current();
    if (current.bundle.version === version) return 'up-to-date';

    const bundle = await CapacitorUpdater.download({
      url: `${UPDATE_BASE}/bundle.zip`,
      version,
    });
    // Applique tout de suite : recharge le webview sur le nouveau bundle.
    await CapacitorUpdater.set({ id: bundle.id });
    return 'updated';
  } catch (err) {
    console.log('Mise à jour manuelle échouée :', err);
    return 'error';
  }
}
