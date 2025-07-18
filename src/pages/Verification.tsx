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
    <div className="min-h-screen p-4 pb-[12vh] flex items-center justify-center">
        
      {/* 🔒 Vérification obligatoire */}
      {!isVerified && (
        <div className="space-y-4 mx-auto">
          <div className="flex items-start gap-2 text-black  border border-[rgba(221,133,2,0.773)] rounded p-3">
            <Info size={20} className="mt-0.5" />
            <p>
              Veuillez entrer le code de vérification pour gerer les chansons
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-100 border border-red-300 rounded p-2">
              <AlertTriangle size={18} />
              <span>{error}</span>
            </div>
          )}

          <div className="relative flex items-center gap-2">
            <KeyRound className="absolute left-3 top-2.5 text-gray-500" size={18} />
            <input
              type="password"
              placeholder="Code de vérification"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full pl-9 p-2 border rounded"
            />
            <button
              onClick={verifyCode}
              className="bg-black text-white px-4 py-2 rounded"
            >
              Vérifier
            </button>
          </div>
        </div>
      )}

    
    </div>
  );
};

export default Verification;
