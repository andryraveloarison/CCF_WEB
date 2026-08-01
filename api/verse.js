// Vercel serverless function — proxy Ollama pour « verset → chants ».
// La clé reste côté serveur (env OLLAMA_CLOUD_*), jamais dans le bundle client.
import { suggestFromVerse } from "./_verseCore.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Méthode non autorisée" });
    return;
  }
  try {
    const result = await suggestFromVerse(req.body?.verse, process.env);
    res.status(200).json(result);
  } catch (e) {
    res.status(e?.status || 502).json({
      error: e?.message || "Erreur lors de l'appel à l'IA.",
    });
  }
}
