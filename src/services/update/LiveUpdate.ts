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
