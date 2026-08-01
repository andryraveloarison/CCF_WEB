// components/BottomNav.tsx
import { NavLink } from 'react-router-dom';

const items = [
  { to: '/', label: 'Chants' },
  { to: '/ia', label: 'Assistant' },
  { to: '/about', label: 'À propos' },
];

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] bg-[var(--paper)] border-t border-[var(--hairline)]">
      <div className="flex justify-around items-center px-6 pt-4 pb-6">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className="flex flex-col items-center gap-2 group"
          >
            {({ isActive }) => (
              <>
                <span
                  className={`h-2 w-2 rounded-full transition-colors ${
                    isActive ? 'bg-[var(--accent)]' : 'bg-transparent border border-[var(--ink-soft)]'
                  }`}
                />
                <span
                  className={`eyebrow transition-colors ${
                    isActive ? 'text-[var(--ink)]' : 'text-[var(--ink-soft)]'
                  }`}
                >
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
