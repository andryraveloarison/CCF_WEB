// components/BottomNav.tsx
import { NavLink } from 'react-router-dom';
import { Music, Info, MessageCircle } from 'lucide-react';

const BottomNav = () => {
  return (
    <nav className="min-h-[50px] pb-5 mx-4 rounded-tl-[20px] rounded-tr-[20px] fixed bottom-0 left-0 right-0 bg-black border-t  flex justify-around items-center py-3 md:hidden z-50">
      <NavLink 
        to="/" 
        className={({ isActive }) => 
          `transition duration-200 ${
            isActive 
              ? 'text-[rgba(221,133,2,0.973)]' 
              : 'text-white opacity-80'
          } hover:text-[rgba(221,133,2,0.973)]`
        }
      >
        <Music size={24} />
      </NavLink>

      <NavLink 
        to="/about" 
        className={({ isActive }) => 
          `transition duration-200 ${
            isActive 
              ? 'text-[rgba(221,133,2,0.973)]' 
              : 'text-white opacity-80'
          } hover:text-[rgba(221,133,2,0.973)]`
        }
      >
        <Info size={24} />
      </NavLink>

      {/* <NavLink 
        to="/chat" 
        className={({ isActive }) => 
          `transition duration-200 ${
            isActive 
              ? 'text-[rgba(221,133,2,0.973)]' 
              : 'text-white opacity-80'
          } hover:text-[rgba(221,133,2,0.973)]`
        }
      >
        <MessageCircle size={24} />
      </NavLink> */}
    </nav>
  );
};

export default BottomNav;
