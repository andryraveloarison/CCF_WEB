import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface Song {
  id: string;
  title: string;
  lyrics: string;
}

// Zoom des paroles au pincement (deux doigts). Taille en px, bornée.
const FONT_MIN = 12;
const FONT_MAX = 40;
const FONT_DEFAULT = 15;
const FONT_STORAGE_KEY = 'lyricsFontSize';

const readSavedFontSize = () => {
  const saved = Number(localStorage.getItem(FONT_STORAGE_KEY));
  return saved >= FONT_MIN && saved <= FONT_MAX ? saved : FONT_DEFAULT;
};

const clamp = (v: number) => Math.min(FONT_MAX, Math.max(FONT_MIN, v));

const touchDistance = (touches: TouchList) =>
  Math.hypot(
    touches[0].clientX - touches[1].clientX,
    touches[0].clientY - touches[1].clientY
  );

const Lyrics = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [song, setSong] = useState<Song | null>(null);
  const [fontSize, setFontSize] = useState<number>(readSavedFontSize);

  // Ref du conteneur scrollable : on y attache des listeners tactiles NON
  // passifs (React les pose en passif par défaut, ce qui empêche preventDefault
  // et laisse le scroll perturber le pincement).
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const pinch = useRef<{ startDist: number; startSize: number } | null>(null);
  // Taille courante lisible dans les handlers sans re-attacher les listeners.
  const fontSizeRef = useRef(fontSize);
  fontSizeRef.current = fontSize;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        pinch.current = {
          startDist: touchDistance(e.touches),
          startSize: fontSizeRef.current,
        };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && pinch.current) {
        e.preventDefault(); // pas de scroll pendant le pincement
        const scale = touchDistance(e.touches) / pinch.current.startDist;
        setFontSize(clamp(pinch.current.startSize * scale));
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) pinch.current = null;
    };

    el.addEventListener('touchstart', onTouchStart, { passive: false });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd);
    el.addEventListener('touchcancel', onTouchEnd);
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
      el.removeEventListener('touchcancel', onTouchEnd);
    };
  }, []);

  // Mémorise la taille choisie pour la retrouver sur les autres chants.
  useEffect(() => {
    localStorage.setItem(FONT_STORAGE_KEY, String(Math.round(fontSize)));
  }, [fontSize]);

  useEffect(() => {
    const fetchLyrics = async () => {
      try {
        // 🔍 Tente d'abord de charger depuis le cache (Service Worker)
        const cached = await caches.match("https://hayback.onrender.com/api/song/getAll");
        if (cached) {
          const data: Song[] = await cached.json();
          const found = data.find((s) => s.id === id);
          if (found) {
            setSong(found);
            return;
          }
        }

        // 🌐 Sinon, tente de récupérer depuis l'API
        const res = await fetch("https://hayback.onrender.com/api/song/getAll");
        const data: Song[] = await res.json();
        const found = data.find((s) => s.id === id);
        if (found) setSong(found);
      } catch (error) {
        console.error("Impossible de charger les paroles :", error);
      }
    };

    fetchLyrics();

    const container = document.getElementById('lyrics-scroll');
    container?.scrollTo(0, 0);
  }, [id]);

  if (!song) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-[var(--paper)] text-[var(--ink)]">
        <span className="eyebrow mb-2">Introuvable</span>
        <h2 className="text-xl font-semibold">Chant non trouvé</h2>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-[var(--paper)] text-[var(--ink)]">

      {/* ── Header ─────────────────────────────────────────── */}
      <header className="px-6 pt-8 shrink-0">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[var(--ink)]"
            title="Retour"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--paper)]">
              <ArrowLeft size={16} strokeWidth={2} />
            </span>
          </button>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
            <span className="eyebrow">Paroles</span>
          </div>
        </div>

        <h1 className="mt-6 text-3xl font-semibold tracking-tight leading-tight">
          {song.title}
        </h1>
        {/* Rule with amber accent segment */}
        <div className="mt-6 flex items-center">
          <span className="h-px w-10 bg-[var(--accent)]" />
          <span className="h-px flex-1 bg-[var(--ink)]" />
        </div>
      </header>

      {/* ── Paroles ────────────────────────────────────────── */}
      <div
        ref={scrollRef}
        id="lyrics-scroll"
        className="flex-1 overflow-y-auto px-6 pt-6 pb-40 touch-pan-y"
      >
        <div
          className="leading-relaxed space-y-4 [&_*]:!text-[var(--ink)]"
          style={{ fontSize: `${fontSize}px` }}
          dangerouslySetInnerHTML={{ __html: song.lyrics }}
        />
      </div>
    </div>
  );
};

export default Lyrics;
