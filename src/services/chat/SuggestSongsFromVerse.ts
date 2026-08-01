export interface SongSuggestion {
  id: string | null; // id du chant si retrouvé dans le répertoire, sinon null
  title: string;
  reason: string; // pourquoi ce chant correspond au verset
}

export interface VerseResult {
  passage: string; // contenu du passage biblique (ou résumé)
  songs: SongSuggestion[];
}

// Base API : vide (chemin relatif) sur le web Vercel ; pour l'app native
// Capacitor, définir VITE_API_BASE = https://<ton-domaine-vercel>
const API_BASE = import.meta.env.VITE_API_BASE ?? "";

/**
 * Interroge l'IA (via la fonction serverless /api/verse) avec un verset ou
 * thème et renvoie les chants du répertoire les mieux adaptés.
 */
export const suggestSongsFromVerse = async (
  verse: string
): Promise<VerseResult> => {
  // Pas de réseau → message clair, on n'appelle même pas l'API
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    throw new Error("Erreur de connexion. Vérifie ta connexion internet.");
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE}/api/verse`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verse }),
    });
  } catch {
    // fetch échoue (hors-ligne, DNS, CORS…)
    throw new Error("Erreur de connexion. Vérifie ta connexion internet.");
  }

  // On lit d'abord en texte : la réponse peut ne PAS être du JSON
  // (page HTML d'erreur, API non déployée, fallback hors-ligne…)
  const rawBody = await res.text();
  let data: { error?: string; passage?: string; songs?: SongSuggestion[] } | null =
    null;
  try {
    data = rawBody ? JSON.parse(rawBody) : null;
  } catch {
    data = null; // corps non-JSON (ex. "<!doctype html>…")
  }

  if (!res.ok) {
    if (data?.error) throw new Error(data.error);
    if (res.status === 429)
      throw new Error("Quota IA épuisé. Réessaie plus tard.");
    if (res.status === 401 || res.status === 403)
      throw new Error("Accès à l'IA refusé (clé invalide).");
    if (res.status >= 500)
      throw new Error("Service IA indisponible. Réessaie plus tard.");
    throw new Error(`Erreur ${res.status}. Réessaie plus tard.`);
  }

  if (!data) {
    // Réponse OK mais illisible (HTML au lieu de JSON)
    throw new Error("Service IA momentanément indisponible. Réessaie plus tard.");
  }

  return {
    passage: typeof data.passage === "string" ? data.passage : "",
    songs: Array.isArray(data.songs) ? data.songs : [],
  };
};
