import { useParams, Link } from 'react-router-dom';
import lyricsData from '../data/paroles.json'; // ✅ chargé statiquement

import { useEffect, useState } from 'react';

interface Song {
  id: string;
  title: string;
  lyrics: string;
}

const Lyrics = () => {
  const { id } = useParams<{ id: string }>();
  const [song, setSong] = useState<Song | null>(null);

  useEffect(() => {
    const found = (lyricsData as Song[]).find((s) => s.id === id);
    setSong(found || null);
  }, [id]);

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
      <pre className="whitespace-pre-wrap">{song.lyrics}</pre>
      <Link to="/" className="text-blue-500 hover:underline mt-4 inline-block">
        ← Retour à la liste
      </Link>
    </div>
  );
};

export default Lyrics;
