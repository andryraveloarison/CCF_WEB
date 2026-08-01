import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ReloadButton from "../components/ReloadButton";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 flex flex-col bg-[var(--paper)] text-[var(--ink)]">

      {/* ── Header ─────────────────────────────────────────── */}
      <header className="px-6 pt-8 shrink-0">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--paper)]"
          >
            <ArrowLeft size={16} strokeWidth={2} />
          </button>
          <ReloadButton />
        </div>

        <div className="mt-6 flex items-end justify-between">
          <div>
            <span className="eyebrow">À propos</span>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight leading-none">
              CCF
            </h1>
          </div>
          <img
            src="/logo.png"
            alt="Logo"
            className="w-[72px] h-auto object-contain"
          />
        </div>
        <div className="mt-6 border-t border-[var(--ink)]" />
      </header>

      {/* ── Contenu ────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-6 pt-8 pb-8">
        <span className="eyebrow">Présentation</span>
        <p className="mt-4 text-[15px] leading-relaxed">
          CCF est une application dédiée aux membres du Chœur du Christ en
          Famille.
        </p>
        <p className="mt-4 text-[15px] leading-relaxed">
          Elle permet d'afficher les paroles des chants utilisés lors des
          cultes, des répétitions ou des événements spéciaux.
        </p>

        {/* Carte décorative — dotted grid */}
        <div className="mt-10 border border-[var(--hairline)] bg-[var(--paper-2)]">
          <div className="flex items-center justify-between px-5 pt-5">
            <span className="eyebrow">Chœur du Christ en Famille</span>
            <span className="eyebrow">01</span>
          </div>
          <div className="flex items-center justify-between px-5 pb-5 pt-6">
            <p className="text-[15px] leading-snug max-w-[55%]">
              Chanter ensemble,
              <br />
              en famille.
            </p>
            <div className="dotgrid h-16 w-24" />
          </div>
        </div>
      </div>

      {/* ── Footer — ancré en bas de page ──────────────────── */}
      <footer className="shrink-0 px-6 pb-8 pt-4 border-t border-[var(--hairline)] flex items-center justify-between">
        <span className="eyebrow">Made with 🖤</span>
        <span className="eyebrow">CCF</span>
      </footer>
    </div>
  );
};

export default About;
