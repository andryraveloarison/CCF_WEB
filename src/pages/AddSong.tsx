import { useState } from "react";
import {
  PlusCircle,
  Trash2,
  Music2,
  User,
  Save,
  AlertTriangle,
  KeyRound,
  Info
} from "lucide-react";
import { saveSong } from "../services/song/ManageSong"; // ajuste le chemin si nécessaire

type LyricsBlock = {
  id: number;
  type: "couplet" | "refrain";
  text: string;
};

const AddSongForm = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [lyrics, setLyrics] = useState<LyricsBlock[]>([]);
  const [code, setCode] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState("");

  const VALID_CODE = "1234"; 

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
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
  
    setError("");
  
    // 🔁 Formatage des lyrics avec <br><br> et <b> pour les refrains
    const formattedLyrics = lyrics
      .map((block) => {
        const content = `${block.type.toUpperCase()}:\n${block.text}`;
        return block.type === "refrain" ? `<b>${content}</b>` : content;
      })
      .join("<br><br>");
  
    const song = {
      title,
      author,
      lyrics: formattedLyrics,
    };
  
    const success = await saveSong(song);
    if (success) {
      await fetch("https://hayback.onrender.com/api/song/getAll", { mode: "cors" })
      alert("✅ Chanson enregistrée avec succès !");
      // Optionnel : vider les champs
      setTitle("");
      setAuthor("");
      setLyrics([]);
    } else {
      setError("❌ Une erreur est survenue lors de l'enregistrement.");
    }
  };
  

  const verifyCode = () => {
    if (code === VALID_CODE) {
      setIsVerified(true);
      setError("");
    } else {
      setError("Code de vérification incorrect.");
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* 🔒 Vérification obligatoire */}
      {!isVerified && (
        <>
          <div className="flex items-start gap-2 text-blue-700 bg-blue-100 border border-blue-300 rounded p-3">
            <Info size={20} className="mt-0.5" />
            <p>
              Pour ajouter une chanson, veuillez entrer le code de vérification fourni par l'administrateur.
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-100 border border-red-300 rounded p-2">
              <AlertTriangle size={18} />
              <span>{error}</span>
            </div>
          )}

          <div className="relative flex items-center gap-2">
            <KeyRound className="absolute left-3 top-2.5 text-gray-500" size={18} />
            <input
              type="password"
              placeholder="Code de vérification"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full pl-9 p-2 border rounded"
            />
            <button
              onClick={verifyCode}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Vérifier
            </button>
          </div>
        </>
      )}

      {/* 🎵 Formulaire complet après vérification */}
      {isVerified && (
        <>
          {/* Titre */}
          <div className="relative">
            <Music2 className="absolute left-3 top-2.5 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Titre "
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full pl-9 p-2 border rounded"
            />
          </div>

          {/* Auteur */}
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

          {/* Ajouter couplet / refrain */}
          <div className="flex gap-2">
            <button
              onClick={() => addLyricsBlock("couplet")}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded"
            >
              <PlusCircle size={18} />
              Couplet
            </button>
            <button
              onClick={() => addLyricsBlock("refrain")}
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded"
            >
              <PlusCircle size={18} />
              Refrain
            </button>
          </div>

          {/* Blocs de lyrics */}
          {lyrics.map((block) => (
            <div key={block.id} className="border p-3 rounded relative bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold">{block.type.toUpperCase()}</span>
                <button
                  onClick={() => removeLyricsBlock(block.id)}
                  title="Supprimer"
                >
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

          {/* Bouton de soumission */}
          {lyrics.length > 0 && (
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded"
            >
              <Save size={18} />
              Ajouter la chanson
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default AddSongForm;
