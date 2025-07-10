import { Loader2 } from "lucide-react";

const SaveSongLoader = () => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center z-50">
      <Loader2 className="animate-spin text-black" size={48} />
      <p className="mt-4 text-xl font-semibold">Enregistrement en cours...</p>
    </div>
  );
};

export default SaveSongLoader;
