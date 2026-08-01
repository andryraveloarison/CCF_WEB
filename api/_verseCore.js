// Logique partagée « verset → chants ».
// Utilisée par la fonction Vercel (api/verse.js) ET par le middleware de dev Vite.
import lyrics from "../src/data/lyrics.json" with { type: "json" };

const buildSongContext = () =>
  lyrics
    .map((song) => {
      const clean = song.lyrics
        .replace(/<br\s*\/?>/gi, " ")
        .replace(/<\/?[^>]+(>|$)/g, "")
        .replace(/\s+/g, " ")
        .slice(0, 600)
        .trim();
      return `#${song.id} — ${song.title}\n${clean}`;
    })
    .join("\n\n");

const normalize = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/gu, "")
    .replace(/[^a-z0-9]/g, "");

const findId = (title) => {
  const n = normalize(title || "");
  if (!n) return null;
  const match = lyrics.find(
    (s) =>
      normalize(s.title) === n ||
      normalize(s.title).includes(n) ||
      n.includes(normalize(s.title))
  );
  return match ? match.id : null;
};

const extractJson = (text) => {
  const cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("Réponse IA sans JSON");
  return JSON.parse(cleaned.slice(start, end + 1));
};

const httpError = (status, message) => {
  const e = new Error(message);
  e.status = status;
  return e;
};

/**
 * @param {string} verse  verset ou thème saisi par l'utilisateur
 * @param {Record<string,string|undefined>} env  variables d'environnement
 * @returns {Promise<Array<{id:string|null,title:string,reason:string}>>}
 */
export async function suggestFromVerse(verse, env) {
  const HOST = env.OLLAMA_CLOUD_HOST || "https://ollama.com";
  const MODEL = env.OLLAMA_CLOUD_MODEL || "gemma4:cloud";
  const API_KEY = env.OLLAMA_CLOUD_API_KEY || "";

  const v = String(verse || "").trim();
  if (!API_KEY)
    throw httpError(500, "OLLAMA_CLOUD_API_KEY manquante côté serveur (.env).");
  if (!v) throw httpError(400, "Verset manquant.");

  const systemPrompt = `Tu es une assistante liturgique pour le Chœur du Christ en Famille (CCF).
On te donne une référence biblique (livre chapitre:versets) ou un thème. En te basant sur le contenu de ce passage, tu dois proposer, UNIQUEMENT parmi le répertoire ci-dessous, les 3 à 5 chants les mieux adaptés (par thème, message ou paroles).

Répertoire (id — titre puis extrait) :
${buildSongContext()}

Réponds STRICTEMENT en JSON, sans texte autour, au format :
{"passage":"<le texte du passage biblique demandé ; s'il est long, un résumé en une ou deux phrases>","songs":[{"id":"<id du chant>","title":"<titre exact>","reason":"<une phrase expliquant le lien avec le passage>"}]}
N'invente aucun chant hors du répertoire.`;

  let ollama;
  try {
    ollama = await fetch(`${HOST}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        stream: false,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Verset / thème : ${v}` },
        ],
      }),
    });
  } catch {
    throw httpError(502, "Une erreur de connexion. Réessaie plus tard.");
  }

  if (!ollama.ok) {
    if (ollama.status === 429)
      throw httpError(429, "Une erreur de connexion. Réessaie plus tard.");
    if (ollama.status === 401 || ollama.status === 403)
      throw httpError(502, "Une erreur de connexion");
    throw httpError(502, "Une erreur de connexion. Réessaie plus tard.");
  }

  let parsed;
  try {
    const data = await ollama.json();
    const content =
      data?.message?.content ?? data?.choices?.[0]?.message?.content ?? "";
    parsed = extractJson(content);
  } catch {
    throw httpError(502, "Une erreur de connexion. Réessaie plus tard.");
  }
  const raw = Array.isArray(parsed.songs) ? parsed.songs : [];

  const songs = raw.map((s) => ({
    title: s.title,
    reason: s.reason || "",
    id:
      findId(s.title) ||
      (s.id && lyrics.some((l) => l.id === s.id) ? s.id : null),
  }));

  return { passage: String(parsed.passage || "").trim(), songs };
}
