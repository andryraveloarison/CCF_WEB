import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLyricsPage = location.pathname.startsWith('/lyrics');
  const isChatPage = location.pathname.startsWith('/about');
  const isAboutPage = location.pathname.startsWith('/chat');

  return (
    <nav className="bg-blue-600 text-white px-4 py-3 fixed top-0 left-0 right-0 z-50 shadow">
      <div className="relative flex items-center justify-center h-6 max-w-4xl mx-auto">
        {/* Titre toujours centré absolument */}
        <div className="absolute left-1/2 transform -translate-x-1/2 text-lg font-semibold">
          CCF
        </div>

        {/* Bouton retour aligné à gauche */}
        {(isLyricsPage || isChatPage || isAboutPage) && (
          <button
            onClick={() => navigate(-1)}
            className="absolute left-0 flex items-center gap-1 text-white hover:opacity-80"
          >
            <ArrowLeft size={20} />
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
