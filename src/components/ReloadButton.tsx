import { useState } from "react";
import { RefreshCcw, Loader2 } from "lucide-react";

type Props = {
  onReload?: () => void ;
};

const ReloadButton = ({ onReload }: Props) => {
  const [loading, setLoading] = useState(false);

  const handleReload = () => {
    onReload && onReload()
    setLoading(true);
    setTimeout(() => {
      window.location.reload(); // ou autre action
    }, 2000);
  };

  return (
    <button
      onClick={handleReload}
      disabled={loading}
      className={`p-1 rounded transition duration-200 ${loading ? "opacity-50" : ""}`}
      title="Actualiser"
    >
      {loading ? (
        <Loader2 size={24} className="animate-spin text-[rgba(221,133,2,0.973)]" />
      ) : (
        <RefreshCcw size={24} />
      )}
    </button>
  );
};

export default ReloadButton;
