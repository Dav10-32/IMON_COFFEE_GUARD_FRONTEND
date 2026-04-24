import { Home, MousePointerClick, Bell, User } from 'lucide-react';

interface BottomNavProps {
  current: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { id: 'home', label: 'Inicio', icon: Home },
  { id: 'traps', label: 'Trampas', icon: MousePointerClick },
  { id: 'alerts', label: 'Alertas', icon: Bell },
  { id: 'profile', label: 'Perfil', icon: User },
];

export default function BottomNav({ current, onNavigate }: BottomNavProps) {
  return (
    <nav className="bg-cg-white border-t border-cg-cream px-2 pt-2 pb-3 flex items-center justify-around select-none shrink-0 z-50">
      {navItems.map((item) => {
        const isActive = current === item.id;
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-colors ${
              isActive
                ? 'text-cg-medium'
                : 'text-gray-400'
            }`}
          >
            <Icon size={26} strokeWidth={isActive ? 2.5 : 2} />
            <span className={`text-xs ${isActive ? 'font-semibold' : 'font-medium'}`}>
              {item.label}
            </span>
            {isActive && (
              <span className="w-6 h-1 bg-cg-medium rounded-full mt-0.5" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
