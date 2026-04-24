import { LogOut, MessageCircle, User, MapPin, Ruler, Users, MousePointerClick } from 'lucide-react';
import type { Farmer } from '../types';

interface ProfileProps {
  farmer: Farmer;
  onLogout: () => void;
}

export default function Profile({ farmer, onLogout }: ProfileProps) {
  return (
    <div className="flex-1 flex flex-col bg-cg-cream overflow-hidden">
      {/* Header */}
      <div className="bg-cg-dark px-5 pt-6 pb-8 rounded-b-[28px] shadow-md shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-cg-medium rounded-2xl flex items-center justify-center border-2 border-cg-gold/30">
            <User size={32} className="text-cg-cream" />
          </div>
          <div>
            <h2 className="text-cg-cream text-xl font-extrabold">{farmer.name}</h2>
            <p className="text-cg-light text-sm font-medium">Caficultor</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-4">
        {/* Farm info card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
          <h3 className="text-cg-dark font-bold text-lg mb-4">Mi Finca</h3>
          
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cg-light/15 rounded-xl flex items-center justify-center shrink-0">
                <MapPin size={18} className="text-cg-medium" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Nombre y ubicación</p>
                <p className="text-cg-dark font-bold text-base">{farmer.farmName}</p>
                <p className="text-gray-600 text-sm font-medium">{farmer.municipality}, {farmer.department}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cg-gold/15 rounded-xl flex items-center justify-center shrink-0">
                <Ruler size={18} className="text-cg-gold" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Extensión</p>
                <p className="text-cg-dark font-bold text-base">{farmer.hectares} hectáreas</p>
              </div>
            </div>
            
            {farmer.cooperative && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cg-light/15 rounded-xl flex items-center justify-center shrink-0">
                  <Users size={18} className="text-cg-medium" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Cooperativa</p>
                  <p className="text-cg-dark font-bold text-base">{farmer.cooperative}</p>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cg-green/15 rounded-xl flex items-center justify-center shrink-0">
                <MousePointerClick size={18} className="text-cg-green" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Trampas activas</p>
                <p className="text-cg-dark font-bold text-base">{farmer.activeTraps} de {farmer.totalTraps}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3">
          <a
            href="https://wa.me/573001234567?text=Hola%20Coffee%20Guard,%20necesito%20ayuda%20con%20mi%20trampa"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#25D366] text-white font-bold text-lg py-4 rounded-2xl shadow-md active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
          >
            <MessageCircle size={22} />
            Contactar soporte por WhatsApp
          </a>
          
          <button onClick={onLogout} className="w-full bg-white text-cg-red font-bold text-lg py-4 rounded-2xl border-2 border-cg-red/20 shadow-sm active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
            <LogOut size={22} />
            Cerrar sesión
          </button>
        </div>

        {/* Version */}
        <p className="text-center text-xs text-gray-400 mt-6 font-medium">Coffee Guard v1.0.3</p>
      </div>
    </div>
  );
}
