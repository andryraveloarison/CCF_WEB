// components/BottomNav.tsx
import { NavLink } from 'react-router-dom';

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 flex justify-around items-center py-2 md:hidden z-50">
      <NavLink 
        to="/" 
        className={({ isActive }) => 
          `flex flex-col items-center text-sm ${
            isActive ? 'text-blue-600 font-bold' : 'text-gray-500'
          }`
        }
      >
        <span>🎵</span>
        <span>Chants</span>
      </NavLink>
      <NavLink 
        to="/about" 
        className={({ isActive }) => 
          `flex flex-col items-center text-sm ${
            isActive ? 'text-blue-600 font-bold' : 'text-gray-500'
          }`
        }
      >
        <span>ℹ️</span>
        <span>À propos</span>
      </NavLink>
      <NavLink 
        to="/chat" 
        className={({ isActive }) => 
          `flex flex-col items-center text-sm ${
            isActive ? 'text-blue-600 font-bold' : 'text-gray-500'
          }`
        }
      >
        <span>💬</span>
        <span>Chat</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;
