import { useState } from "react";
import { RefreshCcw, Loader2 } from "lucide-react";
import { checkForUpdateNow } from "../services/update/LiveUpdate";

type Props = {
  onReload?: () => void ;
};

const ReloadButton = ({ onReload }: Props) => {
  const [loading, setLoading] = useState(false);

  const handleReload = async () => {
    onReload && onReload();
    setLoading(true);

    // En natif : on tente d'abord de récupérer et d'appliquer la dernière
    // version OTA (le nouveau code web). Si 'updated', set() a déjà rechargé
    // l'app ; sinon on recharge simplement le webview (données à jour).
    try {
      const result = await checkForUpdateNow();
      if (result === "updated") return; // set() recharge déjà l'app
    } catch {
      /* on retombe sur le reload classique ci-dessous */
    }

    window.location.reload();
  };

  return (
    <button
      onClick={handleReload}
      disabled={loading}
      className={`p-1 rounded transition duration-200 ${loading ? "opacity-50" : ""}`}
      title="Actualiser"
    >
      {loading ? (
        <Loader2 size={18} strokeWidth={1.5} className="animate-spin text-[var(--ink)]" />
      ) : (
        <RefreshCcw size={18} strokeWidth={1.5} className="text-[var(--ink)]" />
      )}
    </button>
  );
};

export default ReloadButton;
