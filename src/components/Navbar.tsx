import { Menu, Search } from 'lucide-react';

const Navbar = () => {
  return (
    <div className=" fixed relative z-50 bg-black text-white pb-5 rounded-bl-[30px]">
      {/* Conteneur principal */}
      <div className="flex items-center justify-between px-4 pt-6">
        <Menu size={24} />
      </div>

      {/* Barre de recherche */}
      <div className="px-4 mt-4">
        <div className="flex items-center bg-white text-black rounded-full px-4 py-2">
          <input
            type="text"
            placeholder="Search..."
            className="flex-1 bg-transparent outline-none text-sm"
          />
          <Search size={20} className="text-gray-600" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
