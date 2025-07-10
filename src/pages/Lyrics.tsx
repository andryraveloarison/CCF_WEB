import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface Song {
  id: string;
  title: string;
  lyrics: string;
}

const Lyrics = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [song, setSong] = useState<Song | null>(null);

  useEffect(() => {
    const fetchLyrics = async () => {
      try {
        // 🔍 Tente d'abord de charger depuis le cache (Service Worker)
        const cached = await caches.match("https://hayback.onrender.com/api/song/getAll");
        if (cached) {
          const data: Song[] = await cached.json();
          const found = data.find((s) => s.id === id);
          if (found) {
            setSong(found);
            return;
          }
        }

        // 🌐 Sinon, tente de récupérer depuis l'API
        const res = await fetch("https://hayback.onrender.com/api/song/getAll");
        const data: Song[] = await res.json();
        const found = data.find((s) => s.id === id);
        if (found) setSong(found);
      } catch (error) {
        console.error("Impossible de charger les paroles :", error);
      }
    };

    fetchLyrics();

    const container = document.getElementById('lyrics-scroll');
    container?.scrollTo(0, 0);
  }, [id]);

  if (!song) {
    return (
      <div className="p-4 min-h-screen bg-white text-gray-800">
        <h2 className="text-xl font-bold">Chant non trouvé</h2>
      </div>
    );
  }

  return (
    <div className="relative bg-white text-gray-800 min-h-screen">

      
      {/* 🔙 Bouton retour */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 z-50 bg-[rgba(221,133,2,0.773)] p-2 rounded-full  text-black"
        title="Retour"
      >
        <ArrowLeft size={20} />
      </button>

      <div className="fixed top-0 left-0 right-0 z-40 pt-5 pb-5  mb-10 text-center text-black">
        <h2 className="text-xl font-bold px-15">{song.title}</h2>
        <div className="mt-5  px-15 border-b-2 border-black w-[75vw] mx-auto"></div>
  {/* 🧾 Paroles scrollables */}
      <div
        id="lyrics-scroll"
        className=" w-full mt-5 px-4 pb-20 h-screen pb-10 overflow-y-auto"
      >
        <div
          className="text-base pb-50 leading-relaxed space-y-4"
          dangerouslySetInnerHTML={{ __html: song.lyrics }}
        />
      </div>
      </div>




    
    </div>
  );
};

export default Lyrics;
