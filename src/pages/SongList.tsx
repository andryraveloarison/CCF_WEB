import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import songs from "../data/lyrics.json";

const SongList = () => {
  const [search] = useState("");

  const sortedSongs = [...songs].sort((a, b) =>
    a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })
  );

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
    <div className="bg-white text-gray-800 px-4 pt-4 pb-20 rounded-tr-[30px] h-[calc(100vh-64px)]"> {/* 64px est une estimation de la navbar */}
      <div
        // id="main-scroll"
        className=" h-full pr-1"
      >
        <h2 className="text-lg font-semibold mb-2">Liste des chants</h2>

        <ul id="main-scroll"
        className="overflow-y-auto h-full pr-1 space-y-2">
          {filteredSongs.map((song) => (
            <Link
              to={`/lyrics/${song.id}`}
              key={song.id}
              className="rounded-xl p-3 border border-gray-300 flex items-center justify-between hover:bg-gray-100"
            >
              <div>
                <div className="text-sm font-bold">
                  {song.id} - {song.title}
                </div>
              </div>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SongList;
