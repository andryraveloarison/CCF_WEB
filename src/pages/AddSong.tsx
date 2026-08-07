import { useState } from "react";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { saveSong, getSongsFromApi } from "../services/song/ManageSong";
import SaveSongLoader from "../components/SaveSongLoader";

type LyricsBlock = {
  id: number;
  type: "couplet" | "refrain";
  text: string;
};

const AddSongForm = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [lyrics, setLyrics] = useState<LyricsBlock[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const addLyricsBlock = (type: "couplet" | "refrain") => {
    setLyrics((prev) => [...prev, { id: Date.now(), type, text: "" }]);
  };

  const removeLyricsBlock = (id: number) => {
    setLyrics((prev) => prev.filter((block) => block.id !== id));
  };

  const updateLyricsText = (id: number, newText: string) => {
    setLyrics((prev) =>
      prev.map((block) => (block.id === id ? { ...block, text: newText } : block))
    );
  };

  const validateForm = () => {
    if (!title.trim()) return "Le titre est requis.";
    if (lyrics.length === 0) return "Ajoutez au moins un couplet ou un refrain.";
    const hasEmptyBlock = lyrics.some((block) => !block.text.trim());
    if (hasEmptyBlock) return "Tous les blocs de paroles doivent être remplis.";
    return "";
  };

  const handleSubmit = async () => {
    setLoading(true);
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    setError("");

    const formattedLyrics = lyrics
      .map((block) => {
        const textWithBr = block.text.trim().replace(/\n/g, "<br>");
        return block.type === "refrain" ? `<b>${textWithBr}</b>` : textWithBr;
      })
      .join("<br><br>");

    const song = { title, author, lyrics: formattedLyrics };

    const success = await saveSong(song);
    if (success) {
      await getSongsFromApi();
      alert("🎉 Chanson enregistrée !");
      setTitle("");
      setAuthor("");
      setLyrics([]);
    } else {
      setError("❌ Une erreur est survenue lors de l'enregistrement.");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-[var(--paper)] text-[var(--ink)]">
      {loading && <SaveSongLoader />}

      {/* ── Header ─────────────────────────────────────────── */}
      <header className="px-6 pt-8 shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors"
          title="Retour"
        >
          <ArrowLeft size={18} strokeWidth={1.5} />
          <span className="eyebrow">Retour</span>
        </button>

        <div className="mt-6">
          <span className="eyebrow">Nouveau chant</span>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight leading-none">
            Ajouter
          </h1>
        </div>
      </header>

      {/* ── Formulaire ─────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-6 pb-32 mt-6 border-t border-[var(--hairline)]">
        <div className="pt-6">
          <label className="eyebrow">Titre</label>
          <input
            type="text"
            placeholder="Titre du chant"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-2 w-full bg-transparent outline-none text-[15px] border-b border-[var(--hairline)] pb-2 placeholder:text-[var(--ink-soft)]"
          />
        </div>

        <div className="mt-6">
          <label className="eyebrow">Auteur</label>
          <input
            type="text"
            placeholder="Auteur (optionnel)"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="mt-2 w-full bg-transparent outline-none text-[15px] border-b border-[var(--hairline)] pb-2 placeholder:text-[var(--ink-soft)]"
          />
        </div>

        <div className="mt-8 flex items-center gap-3">
          <span className="eyebrow">Paroles</span>
          <div className="flex-1 border-t border-[var(--hairline)]" />
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => addLyricsBlock("couplet")}
            className="flex items-center gap-2 border border-[var(--hairline)] px-4 py-2 text-[10px] uppercase tracking-[0.16em] hover:border-[var(--ink)] transition-colors"
          >
            <Plus size={15} strokeWidth={1.5} />
            Couplet
          </button>
          <button
            onClick={() => addLyricsBlock("refrain")}
            className="flex items-center gap-2 border border-[var(--accent)] text-[var(--accent)] px-4 py-2 text-[10px] uppercase tracking-[0.16em]"
          >
            <Plus size={15} strokeWidth={1.5} />
            Refrain
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {lyrics.map((block) => (
            <div key={block.id} className="border border-[var(--hairline)] p-3">
              <div className="flex items-center justify-between mb-2">
                <span className={"eyebrow " + (block.type === "refrain" ? "text-[var(--accent)]" : "")}>
                  {block.type}
                </span>
                <button
                  onClick={() => removeLyricsBlock(block.id)}
                  title="Supprimer"
                  className="text-[var(--ink-soft)] hover:text-[var(--rust)] transition-colors"
                >
                  <Trash2 size={16} strokeWidth={1.5} />
                </button>
              </div>
              <textarea
                value={block.text}
                onChange={(e) => updateLyricsText(block.id, e.target.value)}
                rows={3}
                placeholder={`Écris le ${block.type}`}
                className="w-full bg-transparent outline-none text-[15px] leading-relaxed resize-y placeholder:text-[var(--ink-soft)]"
              />
            </div>
          ))}
        </div>

        {error && <p className="mt-4 text-[13px] text-[var(--rust)]">{error}</p>}

        {lyrics.length > 0 && (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-8 w-full bg-[var(--ink)] text-[var(--paper)] py-3 text-xs uppercase tracking-[0.18em] disabled:opacity-50"
          >
            Enregistrer le chant
          </button>
        )}
      </div>
    </div>
  );
};

export default AddSongForm;
