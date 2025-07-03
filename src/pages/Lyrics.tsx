import { useParams, Link } from 'react-router-dom';
import lyricsData from '../data/paroles.json';

interface Song {
  id: string;
  title: string;
  lyrics: string;
}

const Lyrics = () => {
  const { id } = useParams<{ id: string }>();
  const song = (lyricsData as Song[]).find(s => s.id === id);

  if (!song) {
    return (
      <div className="p-4 min-h-screen">
        <h2 className="text-xl font-bold">Chant non trouvé</h2>
        <Link to="/" className="text-blue-500 hover:underline">← Retour</Link>
      </div>
    );
  }

  return (
    <div className="p-4 min-h-screen bg-white text-gray-800">
      <h2 className="text-2xl font-bold mb-4">{song.title}</h2>

      {/* 🛡️ Attention : le contenu est injecté en HTML */}
      <div
        className="text-base leading-relaxed"
        dangerouslySetInnerHTML={{ __html: song.lyrics }}
      />

      <Link to="/" className="text-blue-500 hover:underline mt-4 inline-block">
        ← Retour à la liste
      </Link>
    </div>
  );
};

export default Lyrics;
