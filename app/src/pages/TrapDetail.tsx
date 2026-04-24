import { ArrowLeft, AlertTriangle, ShieldCheck, Battery, Wifi, WifiOff, Signal, MessageCircle, ChevronRight } from 'lucide-react';
import type { Trap } from '../types';

interface TrapDetailProps {
  trap: Trap;
  onBack: () => void;
  onReportProblem: (trapName: string) => void;
}

function getStatusInfo(status: Trap['status']) {
  switch (status) {
    case 'active':
      return { color: 'bg-cg-green', text: 'Todo bien - Sin plagas', textColor: 'text-cg-green', icon: <ShieldCheck size={32} className="text-white" /> };
    case 'alert':
      return { color: 'bg-cg-red', text: '¡Alerta! Broca detectada', textColor: 'text-cg-red', icon: <AlertTriangle size={32} className="text-white" /> };
    case 'inactive':
      return { color: 'bg-gray-400', text: 'Trampa inactiva', textColor: 'text-gray-500', icon: <WifiOff size={32} className="text-white" /> };
  }
}

function getConnectivityIcon(status: Trap['connectivity']) {
  switch (status) {
    case 'online':
      return <Wifi size={16} className="text-cg-green" />;
    case 'offline':
      return <WifiOff size={16} className="text-gray-400" />;
    case 'weak':
      return <Signal size={16} className="text-cg-yellow" />;
  }
}

const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export default function TrapDetail({ trap, onBack, onReportProblem }: TrapDetailProps) {
  const statusInfo = getStatusInfo(trap.status);
  const maxValue = Math.max(...trap.weeklyActivity, 1);

  return (
    <div className="flex-1 flex flex-col bg-cg-cream overflow-hidden">
      {/* Header */}
      <div className="bg-cg-dark px-4 pt-4 pb-4 flex items-center gap-3 shrink-0">
        <button 
          onClick={onBack}
          className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center active:bg-white/20 transition-colors"
        >
          <ArrowLeft size={22} className="text-cg-cream" />
        </button>
        <div>
          <h2 className="text-cg-cream text-lg font-extrabold leading-tight">{trap.name}</h2>
          <p className="text-cg-light text-xs font-medium">{trap.location}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Status big card */}
        <div className="px-5 pt-5">
          <div className={`${statusInfo.color} rounded-3xl p-6 text-white shadow-lg`}>
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mb-3">
                {statusInfo.icon}
              </div>
              <p className="text-xl font-extrabold">{statusInfo.text}</p>
              {trap.status === 'alert' && (
                <p className="text-white/80 text-sm mt-2 font-medium">Revisa el cultivo en esta zona lo antes posible</p>
              )}
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="px-5 pt-4 grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-3 text-center shadow-sm">
            <Battery size={20} className={trap.batteryLevel > 30 ? "text-cg-green mx-auto mb-1" : "text-cg-yellow mx-auto mb-1"} />
            <p className="text-lg font-extrabold text-cg-dark">{trap.batteryLevel}%</p>
            <p className="text-xs text-gray-500 font-medium">Batería</p>
          </div>
          <div className="bg-white rounded-2xl p-3 text-center shadow-sm">
            {getConnectivityIcon(trap.connectivity)}
            <p className="text-lg font-extrabold text-cg-dark mt-1 capitalize">{trap.connectivity === 'online' ? 'OK' : trap.connectivity === 'weak' ? 'Baja' : 'Off'}</p>
            <p className="text-xs text-gray-500 font-medium">Señal</p>
          </div>
          <div className="bg-white rounded-2xl p-3 text-center shadow-sm">
            <ShieldCheck size={20} className="text-cg-medium mx-auto mb-1" />
            <p className="text-lg font-extrabold text-cg-dark">{trap.lastDetection}</p>
            <p className="text-xs text-gray-500 font-medium">Detectado</p>
          </div>
        </div>

        {/* Weekly activity chart */}
        <div className="px-5 pt-5">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="text-cg-dark font-bold text-base mb-4">Actividad últimos 7 días</h3>
            <div className="flex items-end justify-between gap-2 h-32">
              {trap.weeklyActivity.map((value, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex items-end justify-center" style={{ height: '80px' }}>
                    <div
                      className={`w-full max-w-[28px] rounded-t-lg ${value > 0 ? 'bg-cg-red' : 'bg-cg-light/40'}`}
                      style={{ height: `${(value / maxValue) * 100}%`, minHeight: value > 0 ? '4px' : '20px' }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-500">{weekDays[i]}</span>
                  <span className={`text-xs font-bold ${value > 0 ? 'text-cg-red' : 'text-gray-400'}`}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Last alerts */}
        {trap.lastAlerts.length > 0 && (
          <div className="px-5 pt-4 pb-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="text-cg-dark font-bold text-base mb-3">Últimas alertas</h3>
              <div className="flex flex-col gap-2">
                {trap.lastAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-3 bg-cg-cream/50 rounded-xl p-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${alert.level === 'high' ? 'bg-cg-red' : alert.level === 'medium' ? 'bg-cg-yellow' : 'bg-cg-green'}`}>
                      <AlertTriangle size={14} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-cg-dark">{alert.date} · {alert.time}</p>
                      <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{alert.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Report problem button */}
        <div className="px-5 pt-2 pb-6">
          <button 
            onClick={() => onReportProblem(trap.name)}
            className="w-full bg-white border-2 border-cg-yellow/30 rounded-2xl p-4 flex items-center justify-between active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cg-yellow/15 rounded-xl flex items-center justify-center">
                <MessageCircle size={20} className="text-cg-yellow" />
              </div>
              <span className="text-cg-dark font-bold text-base">Reportar problema</span>
            </div>
            <ChevronRight size={20} className="text-gray-300" />
          </button>
        </div>
      </div>
    </div>
  );
}
