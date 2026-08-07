import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import SaveSongLoader from "../components/SaveSongLoader";
import { getSongsFromApi } from "../services/song/ManageSong";

type LyricsBlock = {
  id: number;
  type: "couplet" | "refrain";
  text: string;
};

const EditSong = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [lyrics, setLyrics] = useState<LyricsBlock[]>([]);
  const [loading, setLoading] = useState(false);

  // 🧠 Convertir HTML <br>, <b> en blocs
  const parseLyricsToBlocks = (lyricsHTML: string): LyricsBlock[] => {
    const blocks = lyricsHTML.split(/<br><br>/);

    return blocks.map((block, index) => {
      const trimmed = block.trim();

      // Vérifie si le bloc commence par <b> et se termine par </b> — rien d'autre
      const isWrappedInB = /^<b>[\s\S]*<\/b>$/.test(trimmed);

      // Supprime <b> et </b> SEULEMENT s'ils sont au début et à la fin du bloc
      const cleanText = isWrappedInB
        ? trimmed.slice(3, -4).replace(/<br>/g, "\n") // remove <b> and </b>
        : trimmed.replace(/<br>/g, "\n");

      return {
        id: Date.now() + index,
        type: isWrappedInB ? "refrain" : "couplet",
        text: cleanText.trim(),
      };
    });
  };

  // 🧠 Convertir blocs vers HTML
  const blocksToHTML = (blocks: LyricsBlock[]) =>
    blocks
      .map((block) => {
        const withBr = block.text.trim().replace(/\n/g, "<br>");
        return block.type === "refrain" ? `<b>${withBr}</b>` : withBr;
      })
      .join("<br><br>");

  useEffect(() => {
    const fetchSong = async () => {
      try {
        const res = await fetch("https://hayback.onrender.com/api/song/getAll");
        const data = await res.json();
        const found = data.find((s: any) => s.id === id);
        if (!found) return;

        setTitle(found.title);
        setAuthor(found.author || "");
        setLyrics(parseLyricsToBlocks(found.lyrics));
      } catch (err) {
        console.error("Erreur de chargement :", err);
      }
    };

    fetchSong();
  }, [id]);

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

  const handleUpdate = async () => {
    const formattedLyrics = blocksToHTML(lyrics);
    setLoading(true);
    try {
      const res = await fetch(`https://hayback.onrender.com/api/song/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          author,
          lyrics: formattedLyrics,
        }),
      });

      if (res.ok) {
        alert("✅ Chanson mise à jour !");
        await getSongsFromApi();
        navigate("/"); // ou /manageSong
      } else {
        alert("❌ Erreur lors de la mise à jour.");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Erreur réseau.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = confirm("🗑️ Supprimer cette chanson ?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`https://hayback.onrender.com/api/song/delete/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        alert("✅ Chanson supprimée !");
        await getSongsFromApi();

        navigate("/");
      } else {
        alert("❌ Échec de la suppression.");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Erreur réseau.");
    }
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
          <span className="eyebrow">Modifier le chant</span>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight leading-none">
            Éditer
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

        {/* ── Actions ──────────────────────────────────────── */}
        <div className="mt-8 flex gap-3">
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="flex-1 bg-[var(--ink)] text-[var(--paper)] py-3 text-xs uppercase tracking-[0.18em] disabled:opacity-50"
          >
            Enregistrer
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center justify-center gap-2 border border-[var(--rust)] text-[var(--rust)] px-4 py-3 text-xs uppercase tracking-[0.16em] hover:bg-[var(--rust)] hover:text-[var(--paper)] transition-colors"
          >
            <Trash2 size={16} strokeWidth={1.5} />
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditSong;
