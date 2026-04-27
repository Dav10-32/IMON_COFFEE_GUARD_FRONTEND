import { ArrowLeft, AlertTriangle, ShieldCheck, Bell } from 'lucide-react';
import { markAlertRead } from '../services/api';
import type { Alert } from '../types';

interface AlertsProps {
  alerts: Alert[];
  onBack?: () => void;
  showBack?: boolean;
  onAlertRead?: () => void;
}

function getAlertInfo(level: Alert['level']) {
  switch (level) {
    case 'high':
      return { color: 'bg-cg-red', borderColor: 'border-cg-red/20', bgColor: 'bg-cg-red/5', textColor: 'text-cg-red' };
    case 'medium':
      return { color: 'bg-cg-yellow', borderColor: 'border-cg-yellow/20', bgColor: 'bg-cg-yellow/5', textColor: 'text-cg-yellow' };
    case 'low':
      return { color: 'bg-cg-green', borderColor: 'border-cg-green/20', bgColor: 'bg-cg-green/5', textColor: 'text-cg-green' };
  }
}

function getLevelLabel(level: Alert['level']) {
  switch (level) {
    case 'high': return 'Urgente';
    case 'medium': return 'Revisar';
    case 'low': return 'Bajo';
  }
}

export default function Alerts({ alerts, onBack, showBack = false, onAlertRead }: AlertsProps) {
  const sortedAlerts = [...alerts].sort((a, b) => {
    // Sort by read status (unread first) then by date (newest first)
    if (a.read !== b.read) return a.read ? 1 : -1;
    return 0;
  });

  const handleAlertClick = async (alert: Alert) => {
    if (!alert.read) {
      try {
        await markAlertRead(alert.id);
        if (onAlertRead) onAlertRead();
      } catch (err) {
        console.error('Error marking alert as read:', err);
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-cg-cream overflow-hidden">
      {/* Header */}
      <div className="bg-cg-dark px-4 pt-4 pb-5 flex items-center gap-3 shrink-0">
        {showBack && (
          <button 
            onClick={onBack}
            className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center active:bg-white/20 transition-colors"
          >
            <ArrowLeft size={22} className="text-cg-cream" />
          </button>
        )}
        <div className="flex-1">
          <h2 className="text-cg-cream text-xl font-extrabold">Alertas</h2>
          <p className="text-cg-light text-sm mt-0.5">{alerts.length} alertas recientes</p>
        </div>
        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
          <Bell size={20} className="text-cg-cream" />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-4">
        {sortedAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-cg-light/20 rounded-2xl flex items-center justify-center mb-3">
              <ShieldCheck size={32} className="text-cg-medium" />
            </div>
            <p className="text-cg-dark font-bold text-lg">Sin alertas</p>
            <p className="text-gray-500 text-sm mt-1">Tus trampas están en buen estado</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {sortedAlerts.map((alert) => {
              const info = getAlertInfo(alert.level);
              return (
                <div
                  key={alert.id}
                  onClick={() => handleAlertClick(alert)}
                  className={`w-full bg-white rounded-2xl p-4 shadow-sm border-l-4 ${info.borderColor} ${!alert.read ? info.bgColor : ''} ${!alert.read ? 'cursor-pointer active:scale-[0.98] transition-transform' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 ${info.color} rounded-xl flex items-center justify-center shrink-0`}>
                      <AlertTriangle size={18} className="text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-cg-dark font-bold text-base">{alert.trapName}</h3>
                        <span className={`text-xs font-bold text-white px-2 py-0.5 rounded-full ${info.color}`}>
                          {getLevelLabel(alert.level)}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm font-medium">{alert.date} · {alert.time}</p>
                      <p className="text-gray-700 text-sm mt-2 leading-relaxed">{alert.message}</p>
                      
                      {!alert.read && (
                        <div className="mt-3 flex items-center gap-1.5">
                          <span className="w-2 h-2 bg-cg-red rounded-full animate-pulse" />
                          <span className="text-xs font-bold text-cg-red">Toca para marcar como leída</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
