import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, ArrowUpRight } from 'lucide-react';
import { getSongsFromCache } from "../services/song/ManageSong";

type Song = {
  id: string;
  title: string;
  lyrics: string;
};

const ManageSong = () => {
  const [search, setSearch] = useState("");
  const [songs, setSongs] = useState<Song[]>([]);

  const navigate = useNavigate();

  // 🔽 Charger depuis le cache (par défaut, sans requête)
  useEffect(() => {
    getSongsFromCache().then((data) => {
      if (data) setSongs(data);
    });

    const container = document.getElementById('main-scroll');
    if (container) container.scrollTo(0, 0);
  }, []);

  const sortedSongs = [...songs].sort((a, b) =>
    a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })
  );

  const filteredSongs = sortedSongs.filter(song =>
    song.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 flex flex-col bg-[var(--paper)] text-[var(--ink)]">
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="px-6 pt-8 shrink-0">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors"
            title="Retour"
          >
            <ArrowLeft size={18} strokeWidth={1.5} />
            <span className="eyebrow">Retour</span>
          </button>

          <button
            onClick={() => navigate('/addSong')}
            className="flex items-center gap-2 border border-[var(--ink)] px-3 py-2 text-[10px] uppercase tracking-[0.16em] hover:bg-[var(--ink)] hover:text-[var(--paper)] transition-colors"
            title="Ajouter un chant"
          >
            <Plus size={15} strokeWidth={1.5} />
            Ajouter
          </button>
        </div>

        <div className="mt-6 flex items-end justify-between">
          <div>
            <span className="eyebrow">Gestion des chants</span>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight leading-none">
              Gérer
            </h1>
          </div>
          <span className="display text-7xl">
            {String(filteredSongs.length).padStart(2, '0')}
          </span>
        </div>

        <div className="mt-6 border-b border-[var(--hairline)] pb-2">
          <input
            type="text"
            placeholder="Rechercher un chant"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent outline-none text-sm placeholder:text-[var(--ink-soft)]"
          />
        </div>

        <div className="mt-6 flex items-center justify-between">
          <span className="eyebrow">Titre</span>
          <span className="eyebrow">Modifier</span>
        </div>
      </header>

      {/* ── Liste ──────────────────────────────────────────── */}
      <div
        id="main-scroll"
        className="flex-1 overflow-y-auto px-6 pb-32 mt-2 border-t border-[var(--hairline)]"
      >
        {filteredSongs.map((song, index) => (
          <Link
            to={`/song/edit/${song.id}`}
            key={song.id}
            className="group flex items-center justify-between gap-4 py-4 border-b border-[var(--hairline)]"
          >
            <div className="flex items-baseline gap-4 min-w-0">
              <span className="eyebrow tabular-nums shrink-0">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="text-[15px] leading-snug truncate">
                {song.title}
              </span>
            </div>
            <ArrowUpRight
              size={16}
              strokeWidth={1.5}
              className="shrink-0 text-[var(--ink-soft)] group-hover:text-[var(--ink)] transition-colors"
            />
          </Link>
        ))}

        {filteredSongs.length === 0 && (
          <p className="py-10 text-center eyebrow">Aucun résultat</p>
        )}
      </div>
    </div>
  );
};

export default ManageSong;
