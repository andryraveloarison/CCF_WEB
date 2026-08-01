import { useState } from "react";
import {
  AlertTriangle,
  KeyRound,
  Info
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Verification = () => {
  const [code, setCode] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState("");

  const VALID_CODE = "tsyaiko";  

  const navigate = useNavigate()

  const verifyCode = () => {
    if (code === VALID_CODE) {
      setIsVerified(true);
      setError("");
      navigate("/manageSong"); // 🔁 Redirection vers la page de gestion des chansons

    } else {
      setError("Code de vérification incorrect.");
    }
  };


  return (
    <div className="fixed inset-0 flex flex-col justify-center bg-[var(--paper)] text-[var(--ink)] px-6 pb-[14vh]">

      {/* 🔒 Vérification obligatoire */}
      {!isVerified && (
        <div className="w-full max-w-sm mx-auto">
          <span className="eyebrow">Accès restreint</span>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight leading-none">
            Gestion
          </h1>
          <div className="mt-6 border-t border-[var(--ink)]" />

          <div className="mt-6 flex items-start gap-3 text-[var(--ink-soft)]">
            <Info size={16} strokeWidth={1.5} className="mt-0.5 shrink-0" />
            <p className="text-[13px] leading-relaxed">
              Veuillez entrer le code de vérification pour gérer les chansons.
            </p>
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-2 text-red-600">
              <AlertTriangle size={16} strokeWidth={1.5} />
              <span className="text-[13px]">{error}</span>
            </div>
          )}

          <div className="mt-8 flex items-center gap-3 border-b border-[var(--hairline)] pb-2">
            <KeyRound className="text-[var(--ink-soft)]" strokeWidth={1.5} size={16} />
            <input
              type="password"
              placeholder="Code de vérification"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && verifyCode()}
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-[var(--ink-soft)]"
            />
          </div>

          <button
            onClick={verifyCode}
            className="mt-8 w-full bg-[var(--ink)] text-[var(--paper)] py-3 text-xs uppercase tracking-[0.18em]"
          >
            Vérifier
          </button>
        </div>
      )}

    </div>
  );
};

export default Verification;
