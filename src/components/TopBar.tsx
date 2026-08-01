import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, Loader2, Menu, SmartphoneNfc, FilePlus } from 'lucide-react';
import ReloadButton from './ReloadButton';

const APK_URL = '/releases/ccf.apk';
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

type Props = {
  /** Optionnel : action de rechargement des données (sinon recharge la page). */
  onReload?: () => void;
};

/**
 * Barre supérieure commune : marque CCF (rouille) + rechargement + menu
 * (Ajouter un chant / Télécharger l'app). Utilisée sur l'accueil, l'assistant
 * et l'ajout de parole.
 */
const TopBar = ({ onReload }: Props) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 📥 Téléchargement robuste de l'APK (contourne le service worker / PWA)
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
      console.error('Téléchargement APK échoué, repli direct :', err);
      window.location.href = APK_URL;
    } finally {
      setDownloading(false);
      setMenuOpen(false);
    }
  };

  return (
    <div className="flex items-center justify-between">
      {/* Marque CCF — police stylée, en jaune */}
      <span className="brand text-3xl">CCF</span>

      <div className="flex items-center gap-4">
        <ReloadButton onReload={onReload} />
        <div className="relative" ref={menuRef}>
          <Menu
            size={18}
            strokeWidth={1.5}
            className="cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          />
          {menuOpen && (
            <div className="absolute top-9 right-0 z-[110] bg-white rounded-2xl shadow-xl overflow-hidden min-w-[240px]">
              {/* Ajouter un chant — au-dessus du téléchargement */}
              <Link
                to="/Verify"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3.5 text-gray-800 hover:bg-gray-100 text-sm"
              >
                <FilePlus size={18} strokeWidth={1.5} className="shrink-0 text-[var(--accent)]" />
                Ajouter un chant
              </Link>

              <div className="border-t border-gray-100" />

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
  );
};

export default TopBar;
