import { Link } from 'react-router-dom';
import songs from "../data/songs.json"

const SongList = () => {
  return (
    <div className="min-h-screen bg-white p-6 text-gray-800">
      <h1 className="text-2xl font-bold mb-4">📜 Liste des Chants</h1>
      
      <ul className="space-y-2">
        {songs.map((song) => (
          <li key={song.id}>
            <Link
              to={`/lyrics/${song.id}`}
              className="block bg-blue-100 hover:bg-blue-200 px-4 py-2 rounded text-blue-800 font-medium transition"
            >
              {song.title}
            </Link>
          </li>
        ))}
      </ul>
 
      <div className="mt-8">
        <Link
          to="/chat"
          className="inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
        >
          💬 Aller au Chat
        </Link>
      </div>
    </div>
  );
};

export default SongList;
