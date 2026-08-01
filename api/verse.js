// Vercel serverless function — proxy Ollama pour « verset → chants ».
// La clé reste côté serveur (env OLLAMA_CLOUD_*), jamais dans le bundle client.
import lyrics from "../src/data/lyrics.json" with { type: "json" };

const HOST = process.env.OLLAMA_CLOUD_HOST || "https://ollama.com";
const MODEL = process.env.OLLAMA_CLOUD_MODEL || "gemma4:cloud";
const API_KEY = process.env.OLLAMA_CLOUD_API_KEY || "";

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

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Méthode non autorisée" });
    return;
  }
  if (!API_KEY) {
    res.status(500).json({
      error: "OLLAMA_CLOUD_API_KEY manquante côté serveur (réglages Vercel).",
    });
    return;
  }

  const verse = String(req.body?.verse || "").trim();
  if (!verse) {
    res.status(400).json({ error: "Verset manquant." });
    return;
  }

  const systemPrompt = `Tu es une assistante liturgique pour le Chœur du Christ en Famille (CCF).
On te donne un verset biblique ou un thème. Tu dois proposer, UNIQUEMENT parmi le répertoire ci-dessous, les 3 à 5 chants les mieux adaptés à ce verset (par thème, message ou paroles).

Répertoire (id — titre puis extrait) :
${buildSongContext()}

Réponds STRICTEMENT en JSON, sans texte autour, au format :
{"songs":[{"id":"<id du chant>","title":"<titre exact>","reason":"<une phrase expliquant le lien avec le verset>"}]}
N'invente aucun chant hors du répertoire.`;

  try {
    const ollama = await fetch(`${HOST}/api/chat`, {
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
          { role: "user", content: `Verset / thème : ${verse}` },
        ],
      }),
    });

    if (!ollama.ok) {
      res
        .status(502)
        .json({ error: `Erreur Ollama : ${ollama.status} ${ollama.statusText}` });
      return;
    }

    const data = await ollama.json();
    const content =
      data?.message?.content ?? data?.choices?.[0]?.message?.content ?? "";

    const parsed = extractJson(content);
    const raw = Array.isArray(parsed.songs) ? parsed.songs : [];

    const songs = raw.map((s) => ({
      title: s.title,
      reason: s.reason || "",
      id:
        findId(s.title) ||
        (s.id && lyrics.some((l) => l.id === s.id) ? s.id : null),
    }));

    res.status(200).json({ songs });
  } catch (e) {
    res.status(502).json({ error: e?.message || "Erreur lors de l'appel à l'IA." });
  }
}
