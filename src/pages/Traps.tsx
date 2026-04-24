import { Battery, Wifi, WifiOff, Signal, ChevronRight, Plus, AlertTriangle, ShieldCheck, PowerOff } from 'lucide-react';
import type { Trap } from '../types';

interface TrapsProps {
  traps: Trap[];
  onViewTrapDetail: (trap: Trap) => void;
  onAddTrap: () => void;
}

function getStatusInfo(status: Trap['status']) {
  switch (status) {
    case 'active':
      return { color: 'bg-cg-green', text: 'Activa', icon: <ShieldCheck size={18} className="text-white" /> };
    case 'alert':
      return { color: 'bg-cg-red', text: '¡Alerta!', icon: <AlertTriangle size={18} className="text-white" /> };
    case 'inactive':
      return { color: 'bg-gray-400', text: 'Inactiva', icon: <PowerOff size={18} className="text-white" /> };
  }
}

function getConnectivityIcon(status: Trap['connectivity']) {
  switch (status) {
    case 'online':
      return <Wifi size={14} className="text-cg-green" />;
    case 'offline':
      return <WifiOff size={14} className="text-gray-400" />;
    case 'weak':
      return <Signal size={14} className="text-cg-yellow" />;
  }
}

export default function Traps({ traps, onViewTrapDetail, onAddTrap }: TrapsProps) {
  return (
    <div className="flex-1 flex flex-col bg-cg-cream overflow-hidden">
      {/* Header */}
      <div className="bg-cg-dark px-5 pt-5 pb-5 rounded-b-[28px] shadow-md shrink-0">
        <h2 className="text-cg-cream text-xl font-extrabold">Mis Trampas</h2>
        <p className="text-cg-light text-sm mt-1">{traps.length} trampas registradas</p>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-4">
        <div className="flex flex-col gap-3">
          {traps.map((trap) => {
            const statusInfo = getStatusInfo(trap.status);
            return (
              <button
                key={trap.id}
                onClick={() => onViewTrapDetail(trap)}
                className="w-full bg-white rounded-2xl p-4 shadow-sm text-left active:scale-[0.98] transition-transform flex items-start gap-3"
              >
                <div className={`w-12 h-12 ${statusInfo.color} rounded-2xl flex items-center justify-center shrink-0`}>
                  {statusInfo.icon}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-cg-dark font-bold text-base">{trap.name}</h3>
                    <span className={`text-xs font-bold text-white px-2 py-0.5 rounded-full ${statusInfo.color}`}>
                      {statusInfo.text}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm font-medium truncate">{trap.location}</p>
                  
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1">
                      <Battery size={14} className={trap.batteryLevel > 30 ? "text-cg-green" : "text-cg-yellow"} />
                      <span className="text-xs font-semibold text-gray-600">{trap.batteryLevel}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {getConnectivityIcon(trap.connectivity)}
                      <span className="text-xs font-semibold text-gray-600 capitalize">
                        {trap.connectivity === 'online' ? 'Conectada' : trap.connectivity === 'weak' ? 'Señal baja' : 'Sin señal'}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-400 mt-1 font-medium">Última detección: {trap.lastDetection}</p>
                </div>
                
                <ChevronRight size={20} className="text-gray-300 shrink-0 mt-3" />
              </button>
            );
          })}
        </div>

        {/* Add trap button */}
        <button onClick={onAddTrap} className="w-full mt-4 bg-white border-2 border-dashed border-cg-medium/40 rounded-2xl p-4 flex items-center justify-center gap-2 text-cg-medium font-bold text-base active:scale-[0.98] transition-transform">
          <Plus size={20} />
          Agregar nueva trampa
        </button>
      </div>
    </div>
  );
}
