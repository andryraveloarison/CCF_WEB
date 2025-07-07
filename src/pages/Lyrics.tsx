import { useParams, Link, useNavigate } from 'react-router-dom';
import lyricsData from '../data/lyrics.json';
import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

interface Song {
  id: string;
  title: string;
  lyrics: string;
}

const Lyrics = () => {
  const { id } = useParams<{ id: string }>();
  const song = (lyricsData as Song[]).find(s => s.id === id);
  const navigate = useNavigate();

  useEffect(() => {
    const container = document.getElementById('lyrics-scroll');
    container?.scrollTo(0, 0);
  }, []);

  if (!song) {
    return (
      <div className="p-4 min-h-screen">
        <h2 className="text-xl font-bold">Chant non trouvé</h2>
        <Link to="/" className="text-blue-500 hover:underline">← Retour</Link>
      </div>
    );
  }

  return (
    <div className="relative bg-white text-gray-800 min-h-screen">
      {/* 🔙 Bouton retour */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 z-50 bg-white p-2 rounded-full  text-black"
        title="Retour"
      >
        <ArrowLeft size={20} />
      </button>

      {/* 🔲 Titre fixé en haut */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-white pt-5 pb-3  text-center border border-gray-300 ">
        <h2 className="text-xl font-bold">{song.title}</h2>
      </div>

      {/* 🧾 Paroles scrollables */}
      <div
        id="lyrics-scroll"
        className="pt-[80px] px-4 pb-20 h-screen   overflow-y-auto"
      >
        <div
          className="text-base leading-relaxed space-y-4"
          dangerouslySetInnerHTML={{ __html: song.lyrics }}
        />
      </div>
    </div>
  );
};

export default Lyrics;
