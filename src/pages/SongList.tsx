import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, Loader2, Menu, SmartphoneNfc, ArrowUpRight } from 'lucide-react';
import ReloadButton from '../components/ReloadButton';
import { getSongsFromApi, getSongsFromCache } from "../services/song/ManageSong";

type Song = {
  id: string;
  title: string;
  lyrics: string;
};

const APK_URL = "/releases/ccf.apk";
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);


const SongList = () => {
  const [search, setSearch] = useState("");
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 📥 Téléchargement robuste de l'APK (contourne le service worker / PWA standalone)
  const downloadApk = async () => {
    try {
      setDownloading(true);
      const res = await fetch(APK_URL, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ccf.apk';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      // Repli : navigation directe, laisse le serveur forcer le téléchargement
      console.error('Téléchargement APK échoué, repli direct :', err);
      window.location.href = APK_URL;
    } finally {
      setDownloading(false);
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 🔽 Charger depuis le cache (par défaut, sans requête)
  useEffect(() => {
    getSongsFromCache().then((data) => {
      if (data) {
        setSongs(data);
      } else {
        setLoading(true)
        fetchFromApi()
      }

    });

    const container = document.getElementById('main-scroll');
    if (container) container.scrollTo(0, 0);
  }, []);


  // 🔽 Requête manuelle via bouton
  const fetchFromApi = async () => {
    const data = await getSongsFromApi();
    setSongs(data);
    setLoading(false)
  };


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
        <div className="flex items-start justify-between">
          <span className="eyebrow">CCF</span>
          <div className="flex items-center gap-4">
            <ReloadButton onReload={fetchFromApi} />
            <div className="relative" ref={menuRef}>
              <Menu
                size={18}
                strokeWidth={1.5}
                className="cursor-pointer"
                onClick={() => setMenuOpen(!menuOpen)}
              />
              {menuOpen && (
                <div className="absolute top-9 right-0 z-50 bg-white rounded-2xl shadow-xl overflow-hidden min-w-[240px]">
                  {isIOS ? (
                    <div className="flex items-center gap-3 px-4 py-3.5 text-gray-500 text-sm">
                      <SmartphoneNfc size={18} strokeWidth={1.5} className="shrink-0 text-[var(--accent)]" />
                      App disponible sur Android uniquement
                    </div>
                  ) : (
                    <button
                      onClick={downloadApk}
                      disabled={downloading}
                      className="flex w-full items-center gap-3 px-4 py-3.5 text-left text-gray-800 hover:bg-gray-100 text-sm disabled:opacity-60"
                    >
                      {downloading ? (
                        <Loader2 size={18} strokeWidth={1.5} className="animate-spin text-[var(--accent)] shrink-0" />
                      ) : (
                        <Download size={18} strokeWidth={1.5} className="text-[var(--accent)] shrink-0" />
                      )}
                      {downloading ? 'Téléchargement…' : "Télécharger l'app Android"}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Big display count + title */}
        <div className="mt-6 flex items-end justify-between">
          <div>
            <span className="eyebrow">Tous les chants</span>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight leading-none">
              Chants
            </h1>
          </div>
          <span className="display text-7xl">
            {String(filteredSongs.length).padStart(2, '0')}
          </span>
        </div>

        {/* Search — minimal underline */}
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
          <span className="eyebrow">Index</span>
        </div>
      </header>

      {/* ── Liste ──────────────────────────────────────────── */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 size={40} strokeWidth={1.5} className="animate-spin text-[var(--ink)]" />
        </div>
      ) : (
        <div
          id="main-scroll"
          className="flex-1 overflow-y-auto px-6 pb-32 mt-2 border-t border-[var(--hairline)]"
        >
          {filteredSongs.map((song, index) => (
            <Link
              to={`/lyrics/${song.id}`}
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
      )}
    </div>
  );
};

export default SongList;
