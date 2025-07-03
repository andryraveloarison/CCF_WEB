import { useParams, Link } from 'react-router-dom';
import lyricsData from '../data/lyrics.json';
import { useEffect } from 'react';

interface Song {
  id: string;
  title: string;
  lyrics: string;
}

const Lyrics = () => {
  const { id } = useParams<{ id: string }>();
  const song = (lyricsData as Song[]).find(s => s.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
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
    <div className="mt-16 mb-16 p-4 min-h-screen bg-white text-gray-800">
      <h2 className="text-2xl font-bold mb-4">{song.title}</h2>

      {/* 🛡️ Attention : le contenu est injecté en HTML */}
      <div
        className="text-base leading-relaxed"
        dangerouslySetInnerHTML={{ __html: song.lyrics }}
      />
    </div>
  );
};

export default Lyrics;
