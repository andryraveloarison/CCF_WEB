import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Search } from 'lucide-react';
import ReloadButton from '../components/ReloadButton';
import { getSongsFromApi, getSongsFromCache } from "../services/song/ManageSong";

type Song = {
  id: string;
  title: string;
  lyrics: string;
};

const SongList = () => {
  const [search, setSearch] = useState("");
  const [songs, setSongs] = useState<Song[]>([]);

  // 🔽 Charger depuis le cache (par défaut, sans requête)
  useEffect(() => {
    getSongsFromCache().then((data) => {
      if (data) setSongs(data);
    });
  
    const container = document.getElementById('main-scroll');
    if (container) container.scrollTo(0, 0);
  }, []);
  

  // 🔽 Requête manuelle via bouton
  const fetchFromApi = async () => {
    const data = await getSongsFromApi();
    setSongs(data);
  };
  

  const sortedSongs = [...songs].sort((a, b) =>
    a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })
  );

  const filteredSongs = sortedSongs.filter(song =>
    song.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>

      {/* Header */}
      <div className="fixed top-0 left-0 h-[20vh] right-0 z-50 bg-black text-white rounded-bl-[30px]">
        <div className="flex items-center justify-between px-4 pt-6">
        <Menu className="cursor-pointer" />
        <ReloadButton onReload={fetchFromApi} />
        </div>

        <div className="px-4 mt-4">
          <div className="flex items-center bg-white text-black rounded-[12px] px-4 py-2">
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



      {/* Liste */}
      <div className="fixed top-[20vh] bg-black">
        <div className="rounded-tr-[30px] w-full pt-5 left-0 w-screen bg-white text-gray-800 pb-20 h-[calc(100vh-100px)]">
          <h2 className="text-xl font-bold mb-2 px-5">Liste des chants</h2>
          <div>
            <div
              id="main-scroll"
              className="px-4 overflow-y-auto max-h-[calc(100vh-240px)] pb-[12vh] space-y-2"
            >
              {filteredSongs.map((song, index) => (
                <Link
                  to={`/lyrics/${song.id}`}
                  key={song.id}
                  className="rounded-xl p-3 border border-gray-300 flex items-center justify-between hover:bg-gray-100"
                >
                  <div>
                    <div className="text-sm font-bold">
                      {index + 1} - {song.title}
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
