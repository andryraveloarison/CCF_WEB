import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Sparkles, ArrowUpRight, ChevronDown } from "lucide-react";
import TopBar from "../components/TopBar";
import {
  suggestSongsFromVerse,
  type SongSuggestion,
} from "../services/chat/SuggestSongsFromVerse";
import bibleData from "../data/bible.json";

// { "Genèse": [31, 25, ...], ... } → nb de versets par chapitre
const bible = bibleData as Record<string, number[]>;
const BOOKS = Object.keys(bible);

const range = (n: number) => Array.from({ length: n }, (_, i) => i + 1);

// Raccourcit un texte trop long pour l'affichage
const summarize = (t: string, n = 120) =>
  t.length > n ? `${t.slice(0, n - 1).trimEnd()}…` : t;

// Style commun des menus déroulants
const selectClass =
  "w-full appearance-none bg-transparent border-b border-[var(--hairline)] py-2 pr-7 text-[15px] outline-none focus:border-[var(--ink)] disabled:opacity-40";

const Verse = () => {
  const [book, setBook] = useState("");
  const [chapter, setChapter] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const [askedRef, setAskedRef] = useState("");
  const [passage, setPassage] = useState("");
  const [results, setResults] = useState<SongSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  // Options dépendantes du choix courant
  const chapterCount = book ? bible[book].length : 0;
  const verseCount =
    book && chapter ? bible[book][Number(chapter) - 1] : 0;

  const startOptions = useMemo(() => range(verseCount), [verseCount]);
  const endOptions = useMemo(
    () =>
      verseCount && start
        ? range(verseCount).filter((v) => v >= Number(start))
        : [],
    [verseCount, start]
  );

  // Réinitialise la cascade quand un niveau supérieur change
  const onBook = (v: string) => {
    setBook(v);
    setChapter("");
    setStart("");
    setEnd("");
  };
  const onChapter = (v: string) => {
    setChapter(v);
    setStart("");
    setEnd("");
  };
  const onStart = (v: string) => {
    setStart(v);
    setEnd((prev) => (prev && Number(prev) >= Number(v) ? prev : ""));
  };

  const buildRef = () => {
    let ref = `${book} ${chapter}:${start}`;
    if (end && Number(end) > Number(start)) ref += `-${end}`;
    return ref;
  };

  const canAsk = book && chapter && start && !loading;

  const ask = async () => {
    if (!canAsk) return;
    const ref = buildRef();

    setLoading(true);
    setError("");
    setSearched(true);
    setAskedRef(ref);
    setPassage("");
    setResults([]);
    try {
      const { passage: text, songs } = await suggestSongsFromVerse(ref);
      setPassage(text);
      setResults(songs);
      if (songs.length === 0) setError("Aucun chant correspondant trouvé.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur lors de l'appel à l'IA.");
    } finally {
      setLoading(false);
    }
  };

  const Chevron = () => (
    <ChevronDown
      size={16}
      strokeWidth={1.5}
      className="pointer-events-none absolute right-0 top-2.5 text-[var(--ink-soft)]"
    />
  );

  return (
    <div className="fixed inset-0 flex flex-col bg-[var(--paper)] text-[var(--ink)]">

      {/* ── Header ─────────────────────────────────────────── */}
      <header className="px-6 pt-8 shrink-0">
        <TopBar />

        <div className="mt-6 flex items-center justify-between">
          <span className="eyebrow">Assistant IA</span>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
            <span className="eyebrow">Verset → Chants</span>
          </div>
        </div>

        <h1 className="mt-6 text-4xl font-semibold tracking-tight leading-none">
          Trouver un chant
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-[var(--ink-soft)]">
          Choisissez un passage biblique, l'IA propose les chants du répertoire
          les mieux adaptés.
        </p>

        {/* Sélecteur de référence : livre → chapitre → début → fin */}
        <div className="mt-6 border-t border-[var(--ink)] pt-4">
          <label className="eyebrow">Livre</label>
          <div className="relative mt-1">
            <select
              value={book}
              onChange={(e) => onBook(e.target.value)}
              className={selectClass}
            >
              <option value="" disabled>
                — Sélectionner un livre —
              </option>
              {BOOKS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            <Chevron />
          </div>

          <div className="mt-4 grid grid-cols-3 gap-4">
            <div>
              <label className="eyebrow">Chapitre</label>
              <div className="relative mt-1">
                <select
                  value={chapter}
                  onChange={(e) => onChapter(e.target.value)}
                  disabled={!book}
                  className={selectClass}
                >
                  <option value="" disabled>
                    —
                  </option>
                  {range(chapterCount).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <Chevron />
              </div>
            </div>

            <div>
              <label className="eyebrow">Début</label>
              <div className="relative mt-1">
                <select
                  value={start}
                  onChange={(e) => onStart(e.target.value)}
                  disabled={!chapter}
                  className={selectClass}
                >
                  <option value="" disabled>
                    —
                  </option>
                  {startOptions.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
                <Chevron />
              </div>
            </div>

            <div>
              <label className="eyebrow">Fin</label>
              <div className="relative mt-1">
                <select
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                  disabled={!start}
                  className={selectClass}
                >
                  <option value="">—</option>
                  {endOptions.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
                <Chevron />
              </div>
            </div>
          </div>

          {/* Aperçu de la référence */}
          {book && chapter && start && (
            <p className="mt-3 eyebrow text-[var(--accent)]">{buildRef()}</p>
          )}

          <button
            onClick={ask}
            disabled={!canAsk}
            className="mt-4 w-full flex items-center justify-center gap-2 bg-[var(--ink)] text-[var(--paper)] py-3 text-xs uppercase tracking-[0.18em] disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={15} strokeWidth={1.5} className="animate-spin" />
            ) : (
              <Sparkles size={15} strokeWidth={1.5} />
            )}
            {loading ? "Suggestion…" : "Suggérer"}
          </button>
        </div>
      </header>

      {/* ── Résultats ──────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-32">
        {searched && (
          <>
            {/* Contenu du passage (ou résumé si trop long) */}
            <div className="mb-6 border-l-2 border-[var(--accent)] pl-3">
              <span className="eyebrow">{askedRef}</span>
              {passage ? (
                <p className="mt-1 text-[14px] leading-relaxed italic">
                  « {summarize(passage, 280)} »
                </p>
              ) : (
                !loading &&
                !error && (
                  <p className="mt-1 text-[13px] text-[var(--ink-soft)]">
                    Contenu du passage indisponible.
                  </p>
                )
              )}
            </div>

            {error && (
              <p className="py-2 text-[13px] text-[var(--ink-soft)]">{error}</p>
            )}
          </>
        )}

        {results.length > 0 && (
          <div>
            <div className="flex items-center justify-between border-b border-[var(--hairline)] pb-2">
              <span className="eyebrow">Chants suggérés</span>
              <span className="eyebrow">
                {String(results.length).padStart(2, "0")}
              </span>
            </div>
            {results.map((s, i) => {
              const row = (
                <div className="flex items-start gap-4 py-4">
                  <span className="eyebrow tabular-nums shrink-0 mt-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[15px] font-medium">{s.title}</span>
                      {s.id && (
                        <ArrowUpRight
                          size={15}
                          strokeWidth={1.5}
                          className="text-[var(--accent)] shrink-0"
                        />
                      )}
                    </div>
                    {s.reason && (
                      <p className="mt-1 text-[13px] leading-snug text-[var(--ink-soft)]">
                        {s.reason}
                      </p>
                    )}
                  </div>
                </div>
              );

              return s.id ? (
                <Link
                  key={`${s.title}-${i}`}
                  to={`/lyrics/${s.id}`}
                  className="block border-b border-[var(--hairline)]"
                >
                  {row}
                </Link>
              ) : (
                <div
                  key={`${s.title}-${i}`}
                  className="border-b border-[var(--hairline)]"
                >
                  {row}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Verse;
