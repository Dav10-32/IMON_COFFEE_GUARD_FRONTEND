import { useState } from 'react';
import { ShieldCheck, AlertTriangle, Bell, ChevronRight, Clock } from 'lucide-react';
import type { Trap } from '../types';

interface DashboardProps {
  farmerName: string;
  traps: Trap[];
  unreadAlerts: number;
  onViewTraps: () => void;
  onViewAlerts: () => void;
}

export default function Dashboard({ farmerName, traps, unreadAlerts, onViewTraps, onViewAlerts }: DashboardProps) {
  const [lastUpdate] = useState('Hace 8 minutos');
  
  const activeTraps = traps.filter(t => t.status === 'active').length;
  const alertTraps = traps.filter(t => t.status === 'alert').length;
  
  let statusColor = 'bg-cg-green';
  let statusText = 'Sin plagas';
  let statusIcon = <ShieldCheck size={40} className="text-white" />;
  let statusSub = 'Tus trampas están tranquilas';
  
  if (alertTraps > 0) {
    statusColor = 'bg-cg-red';
    statusText = '¡Alerta broca!';
    statusIcon = <AlertTriangle size={40} className="text-white" />;
    statusSub = `${alertTraps} trampa${alertTraps > 1 ? 's' : ''} detectó broca`;
  }

  return (
    <div className="flex-1 flex flex-col bg-cg-cream overflow-hidden">
      {/* Header */}
      <div className="bg-cg-dark px-5 pt-5 pb-6 rounded-b-[28px] shadow-md shrink-0">
        <h2 className="text-cg-cream text-lg font-semibold">
          Hola, {farmerName.split(' ')[0]} 👋
        </h2>
        <p className="text-cg-light text-sm mt-1">Bienvenido a tu finca</p>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-4 space-y-4">
        {/* Status card - big traffic light */}
        <div className={`${statusColor} rounded-3xl p-5 text-white shadow-lg`}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-white/80 text-sm font-medium mb-1">Estado general</p>
              <p className="text-2xl font-extrabold">{statusText}</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              {statusIcon}
            </div>
          </div>
          <p className="text-white/90 text-sm font-medium">{statusSub}</p>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-cg-light/20 rounded-lg flex items-center justify-center">
                <Bell size={16} className="text-cg-medium" />
              </div>
              <span className="text-cg-dark text-sm font-semibold">Trampas</span>
            </div>
            <p className="text-2xl font-extrabold text-cg-dark">{traps.length}</p>
            <p className="text-xs text-gray-500 font-medium mt-0.5">{activeTraps} activas</p>
          </div>
          
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-cg-gold/20 rounded-lg flex items-center justify-center">
                <Clock size={16} className="text-cg-gold" />
              </div>
              <span className="text-cg-dark text-sm font-semibold">Actualizado</span>
            </div>
            <p className="text-lg font-bold text-cg-dark">{lastUpdate}</p>
            <p className="text-xs text-gray-500 font-medium mt-0.5">Datos recientes</p>
          </div>
        </div>

        {/* Alert badge if unread */}
        {unreadAlerts > 0 && (
          <button 
            onClick={onViewAlerts}
            className="w-full bg-cg-red/10 border border-cg-red/20 rounded-2xl p-4 flex items-center gap-3 active:scale-[0.98] transition-transform"
          >
            <div className="w-10 h-10 bg-cg-red rounded-xl flex items-center justify-center shrink-0">
              <AlertTriangle size={20} className="text-white" />
            </div>
            <div className="text-left flex-1">
              <p className="text-cg-red font-bold text-base">{unreadAlerts} alerta{unreadAlerts > 1 ? 's' : ''} nueva{unreadAlerts > 1 ? 's' : ''}</p>
              <p className="text-cg-red/70 text-sm">Revisa tus trampas ahora</p>
            </div>
            <ChevronRight size={20} className="text-cg-red" />
          </button>
        )}

        {/* Main action buttons */}
        <div className="flex flex-col gap-3 pt-1">
          <button
            onClick={onViewTraps}
            className="w-full bg-cg-medium text-cg-white font-bold text-lg py-4 rounded-2xl shadow-md active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
          >
            <ShieldCheck size={22} />
            Ver mis trampas
          </button>
          <button
            onClick={onViewAlerts}
            className="w-full bg-white text-cg-medium font-bold text-lg py-4 rounded-2xl border-2 border-cg-medium shadow-sm active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
          >
            <Bell size={22} />
            Ver alertas
          </button>
        </div>
      </div>
    </div>
  );
}
