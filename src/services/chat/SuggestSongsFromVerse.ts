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
  const res = await fetch(`${API_BASE}/api/verse`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ verse }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Erreur ${res.status}`);
  }

  const data = await res.json();
  return {
    passage: typeof data.passage === "string" ? data.passage : "",
    songs: Array.isArray(data.songs) ? (data.songs as SongSuggestion[]) : [],
  };
};
