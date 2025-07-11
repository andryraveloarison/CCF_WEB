import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  PlusCircle,
  Trash2,
  Music2,
  User,
  Save,
  Trash,
  ArrowLeft
} from "lucide-react";
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
        await getSongsFromApi()
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
        await getSongsFromApi()

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
    <div className="  ">
      <div className="fixed flex items-center justify-center top-0 left-0 z-50 bg-white w-full h-[10vh]">

       <button onClick={() => navigate(-1)}
          className="fixed top-4 left-4 z-50 bg-[rgba(221,133,2,0.773)] p-2 rounded-full  text-black"
          title="Retour"
            >
            <ArrowLeft size={20} />
        </button>  
       <div className="flex items-center justify-center px-4 pt-1">
            
      {loading && <SaveSongLoader />}

      <h2 className="text-xl font-bold text-center">Modifier la chanson</h2>
      </div>

      </div>

      <div className="p-4 pt-[11vh] space-y-4 pb-18">


      <div className="relative ">
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

      <div className="flex gap-4">
        <button
          onClick={handleUpdate}
          className="flex items-center gap-2 border border-black text-black px-4 py-2 rounded hover:bg-gray-100"
        >
          <Save size={18} />
          Modifier
        </button>

        <button
          onClick={handleDelete}
          className="flex items-center gap-2 border border-red-600 text-red-600 px-4 py-2 rounded hover:bg-red-50"
        >
          <Trash size={18} />
          Supprimer
        </button>
      </div>

      {error && <div className="text-red-600">{error}</div>}
    </div>
    </div>

  );
};

export default EditSong;
