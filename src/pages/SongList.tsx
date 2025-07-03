import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import songs from "../data/lyrics.json";

interface Song {
  id: string;
  title: string;
  lyrics?: string;
}

const SongList = () => {
  const [search, setSearch] = useState("");

  // Trier les chansons par titre alphabétique
  const sortedSongs = [...songs].sort((a, b) =>
    a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })
  );

  // Filtrer selon la recherche (insensible à la casse)
  const filteredSongs = sortedSongs.filter(song =>
    song.title.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const container = document.getElementById('main-scroll');
    if (container) {
      container.scrollTo(0, 0);
    }
  }, []);

  return (
    <div className="mb-16 pt-16 min-h-screen bg-white p-6 text-gray-800">
      <h1 className="text-2xl font-bold mb-4">📜 Liste des Chants</h1>

      <input
        type="text"
        placeholder="Rechercher un chant..."
        className="mb-4 w-full px-3 py-2 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <ul className="space-y-2">
        {filteredSongs.length === 0 && (
          <li>Aucun chant ne correspond à votre recherche.</li>
        )}

        {filteredSongs.map((song, index) => (
          <li key={song.id}>
            <Link
              to={`/lyrics/${song.id}`}
              className="block px-4 py-2 rounded  font-medium transition flex items-center"
            >
              <span className="mr-3 font-semibold">{index + 1}.</span>
              {song.title}
            </Link>
          </li>
        ))}
      </ul>

    </div>
  );
};

export default SongList;
