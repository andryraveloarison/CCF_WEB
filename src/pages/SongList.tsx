import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import songs from "../data/lyrics.json";
import { Menu, RefreshCcw, Search } from 'lucide-react';

const SongList = () => {
  const [search, setSearch] = useState("");

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
    <>
      {/* 🔲 Barre du haut fixe */}
      <div className="fixed top-0 left-0 h-[20vh] right-0 z-50 bg-black text-white  rounded-bl-[30px]">
        <div className="flex items-center justify-between px-4 pt-6">
          <Menu size={24} />

          <button
            onClick={() => window.location.reload()}
            className="p-1 rounded transition duration-200"
            title="Actualiser"
          >
            <RefreshCcw size={24} />
          </button>
        </div>
        <div className="px-4 mt-4">
          <div className="flex items-center bg-white text-black rounded-full px-4 py-2">
            <input
              type="text"
              placeholder="Recherche..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm"
            />
            <Search size={20} className="text-gray-600" />
          </div>
        </div>
      </div>

      {/* 🔲 Zone de scroll sous le header */}
      <div className="fixed top-[20vh] bg-black  ">

        <div className='rounded-tr-[30px] w-full pt-5 left-0 w-screen bg-white text-gray-800  pb-20 h-[calc(100vh-100px)]'>

      <h2 className="text-lg font-semibold mb-2 px-4">Liste des chants</h2>
        <div className=''>

        {/* Liste scrollable */}
        <div
          id="main-scroll"
          className="px-4 overflow-y-auto max-h-[calc(100vh-240px)] pb-5 space-y-2"
        >
          {filteredSongs.map((song, index) => (
            <Link
              to={`/lyrics/${song.id}`}
              key={song.id}
              className="rounded-xl p-3 border border-gray-300 flex items-center justify-between hover:bg-gray-100"
            >
              <div>
                <div className="text-sm font-bold">
                  {index+1} - {song.title}
                </div>
              </div>
            </Link>
          ))}
        </div>
        </div>
        </div>


      </div>
    </>
  );
};

export default SongList;
