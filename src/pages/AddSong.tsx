import { useState } from "react";
import {
  PlusCircle,
  Trash2,
  Music2,
  User,
  Save,
  ArrowLeft
} from "lucide-react";
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
    <div className="p-4 space-y-4 pb-20">
        <div className="fixed flex items-center justify-center top-0 left-0 z-50 bg-white w-full h-[10vh]">

        <button onClick={() => navigate(-1)}
          className="fixed top-4 left-4 z-50 bg-[rgba(221,133,2,0.773)] p-2 rounded-full  text-black"
          title="Retour"
            >
            <ArrowLeft size={20} />
        </button>  
        <div className="flex items-center justify-center px-4 pt-1">
            
        {loading && <SaveSongLoader />}

        <h2 className="text-xl font-bold text-center">Ajouter une chanson</h2>
        </div>

        </div>

      {loading && <SaveSongLoader />}

      <div className="p-4 pt-[11vh] space-y-4 pb-18">


      <div className="relative">
        <Music2 className="absolute left-3 top-2.5 text-gray-500" size={18} />
        <input
          type="text"
          placeholder="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full pl-9 p-2 border rounded"
        />
      </div>

      <div className="relative">
        <User className="absolute left-3 top-2.5 text-gray-500" size={18} />
        <input
          type="text"
          placeholder="Auteur"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-full pl-9 p-2 border rounded"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => addLyricsBlock("couplet")}
          className="flex items-center gap-2 border border-green-600 text-green-600 px-4 py-2 rounded hover:bg-green-50"
        >
          <PlusCircle size={18} />
          Couplet
        </button>
        <button
          onClick={() => addLyricsBlock("refrain")}
          className="flex items-center gap-2 border border-purple-600 text-purple-600 px-4 py-2 rounded hover:bg-purple-50"
        >
          <PlusCircle size={18} />
          Refrain
        </button>
      </div>

      {lyrics.map((block) => (
        <div key={block.id} className="border p-3 rounded relative bg-gray-50">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold">{block.type.toUpperCase()}</span>
            <button onClick={() => removeLyricsBlock(block.id)} title="Supprimer">
              <Trash2 size={18} className="text-red-500" />
            </button>
          </div>
          <textarea
            value={block.text}
            onChange={(e) => updateLyricsText(block.id, e.target.value)}
            className="w-full p-2 border rounded"
            rows={3}
            placeholder={`Écris le ${block.type}`}
          />
        </div>
      ))}

      {lyrics.length > 0 && (
        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 border border-black text-black px-4 py-2 rounded hover:bg-gray-100"
        >
          <Save size={18} />
          Ajouter la chanson
        </button>
      )}

      {error && <div className="text-red-600">{error}</div>}
    </div>

    </div>

  );
};

export default AddSongForm;
