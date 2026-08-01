import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Sparkles, ArrowUpRight } from "lucide-react";
import {
  suggestSongsFromVerse,
  type SongSuggestion,
} from "../services/chat/SuggestSongsFromVerse";

const EXAMPLES = [
  "Cherchez premièrement le royaume de Dieu — Matthieu 6:33",
  "L'Éternel est mon berger — Psaume 23",
  "Que tout ce qui respire loue l'Éternel — Psaume 150",
];

const Verse = () => {
  const [verse, setVerse] = useState("");
  const [results, setResults] = useState<SongSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const ask = async (q?: string) => {
    const query = (q ?? verse).trim();
    if (!query || loading) return;
    if (q) setVerse(q);

    setLoading(true);
    setError("");
    setSearched(true);
    setResults([]);
    try {
      const songs = await suggestSongsFromVerse(query);
      setResults(songs);
      if (songs.length === 0) setError("Aucun chant correspondant trouvé.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur lors de l'appel à l'IA.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-[var(--paper)] text-[var(--ink)]">

      {/* ── Header ─────────────────────────────────────────── */}
      <header className="px-6 pt-8 shrink-0">
        <div className="flex items-center justify-between">
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
          Entrez un verset ou un thème, l'IA propose les chants du répertoire
          les mieux adaptés.
        </p>

        {/* Zone de saisie */}
        <div className="mt-6 border-t border-[var(--ink)] pt-4">
          <textarea
            value={verse}
            onChange={(e) => setVerse(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                ask();
              }
            }}
            rows={2}
            placeholder="Ex : Cherchez premièrement le royaume de Dieu…"
            className="w-full bg-transparent outline-none text-[15px] resize-none placeholder:text-[var(--ink-soft)]"
          />
          <button
            onClick={() => ask()}
            disabled={loading || verse.trim() === ""}
            className="mt-2 w-full flex items-center justify-center gap-2 bg-[var(--ink)] text-[var(--paper)] py-3 text-xs uppercase tracking-[0.18em] disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={15} strokeWidth={1.5} className="animate-spin" />
            ) : (
              <Sparkles size={15} strokeWidth={1.5} />
            )}
            {loading ? "Recherche…" : "Interroger l'IA"}
          </button>
        </div>
      </header>

      {/* ── Résultats ──────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-32">
        {!searched && (
          <div>
            <span className="eyebrow">Exemples</span>
            <div className="mt-3 space-y-px">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  onClick={() => ask(ex)}
                  className="w-full text-left py-3 border-b border-[var(--hairline)] text-[14px] text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <p className="py-6 text-[13px] text-[var(--ink-soft)]">{error}</p>
        )}

        {results.length > 0 && (
          <div>
            <div className="flex items-center justify-between border-b border-[var(--hairline)] pb-2">
              <span className="eyebrow">Chants suggérés</span>
              <span className="eyebrow">{String(results.length).padStart(2, "0")}</span>
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
