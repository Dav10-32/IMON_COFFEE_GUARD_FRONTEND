import { useState, useEffect } from 'react';
import { Zap, AlertTriangle, CheckCircle2, Activity } from 'lucide-react';
import { getTraps, simulateDetection } from '../services/api';

export default function Simulator() {
  const [traps, setTraps] = useState<any[]>([]);
  const [selectedTrap, setSelectedTrap] = useState<string>('');
  const [level, setLevel] = useState<'low' | 'medium' | 'high'>('high');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTraps();
  }, []);

  const loadTraps = async () => {
    try {
      const data = await getTraps();
      setTraps(data);
      if (data.length > 0) {
        setSelectedTrap(data[0]._id);
      }
    } catch (err) {
      console.error('Error loading traps:', err);
    }
  };

  const handleSimulate = async () => {
    if (!selectedTrap) {
      setError('Selecciona una trampa');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await simulateDetection(selectedTrap, level);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Error al simular detección');
    } finally {
      setLoading(false);
    }
  };

  const getLevelInfo = (lvl: string) => {
    switch (lvl) {
      case 'high':
        return { color: 'bg-cg-red', text: 'Alta', icon: <AlertTriangle size={24} /> };
      case 'medium':
        return { color: 'bg-cg-yellow', text: 'Media', icon: <Activity size={24} /> };
      case 'low':
        return { color: 'bg-cg-green', text: 'Baja', icon: <CheckCircle2 size={24} /> };
    }
  };

  const currentLevel = getLevelInfo(level);

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-cg-dark via-cg-medium to-cg-dark overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-8 pb-6 shrink-0">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-cg-gold/20 rounded-2xl flex items-center justify-center">
            <Zap size={28} className="text-cg-gold" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-cg-cream">Simulador IoT</h1>
            <p className="text-cg-light text-sm">Trampa Virtual</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {/* Success Animation */}
        {success && (
          <div className="mb-4 bg-cg-green/20 border-2 border-cg-green rounded-2xl p-4 animate-pulse">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={32} className="text-cg-green" />
              <div>
                <p className="text-cg-cream font-bold text-lg">¡Detección Enviada!</p>
                <p className="text-cg-light text-sm">La alerta se creó exitosamente</p>
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-4 bg-cg-red/20 border-2 border-cg-red rounded-2xl p-4">
            <p className="text-cg-cream font-semibold text-center">{error}</p>
          </div>
        )}

        {/* Trap Selection */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 mb-4">
          <label className="text-cg-cream font-bold text-sm block mb-3">Seleccionar Trampa</label>
          <select
            value={selectedTrap}
            onChange={(e) => setSelectedTrap(e.target.value)}
            className="w-full bg-cg-dark/50 border-2 border-cg-gold/30 rounded-xl px-4 py-4 text-cg-cream font-semibold text-lg focus:outline-none focus:border-cg-gold"
          >
            {traps.map((trap) => (
              <option key={trap._id} value={trap._id}>
                {trap.name} - {trap.location}
              </option>
            ))}
          </select>
        </div>

        {/* Level Selection */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 mb-6">
          <label className="text-cg-cream font-bold text-sm block mb-3">Nivel de Detección</label>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setLevel('low')}
              className={`py-4 rounded-xl font-bold text-sm transition-all ${
                level === 'low'
                  ? 'bg-cg-green text-white scale-105 shadow-lg'
                  : 'bg-cg-dark/50 text-cg-light border border-cg-green/30'
              }`}
            >
              <CheckCircle2 size={20} className="mx-auto mb-1" />
              Baja
            </button>
            <button
              onClick={() => setLevel('medium')}
              className={`py-4 rounded-xl font-bold text-sm transition-all ${
                level === 'medium'
                  ? 'bg-cg-yellow text-white scale-105 shadow-lg'
                  : 'bg-cg-dark/50 text-cg-light border border-cg-yellow/30'
              }`}
            >
              <Activity size={20} className="mx-auto mb-1" />
              Media
            </button>
            <button
              onClick={() => setLevel('high')}
              className={`py-4 rounded-xl font-bold text-sm transition-all ${
                level === 'high'
                  ? 'bg-cg-red text-white scale-105 shadow-lg'
                  : 'bg-cg-dark/50 text-cg-light border border-cg-red/30'
              }`}
            >
              <AlertTriangle size={20} className="mx-auto mb-1" />
              Alta
            </button>
          </div>
        </div>

        {/* Simulate Button */}
        <button
          onClick={handleSimulate}
          disabled={loading || !selectedTrap}
          className={`w-full ${currentLevel?.color} text-white font-extrabold text-xl py-6 rounded-2xl shadow-2xl active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3`}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              Enviando...
            </>
          ) : (
            <>
              {currentLevel?.icon}
              Simular Detección {currentLevel?.text}
            </>
          )}
        </button>

        {/* Info */}
        <div className="mt-6 bg-cg-gold/10 border border-cg-gold/30 rounded-2xl p-4">
          <p className="text-cg-cream text-sm font-semibold mb-2">💡 Cómo usar:</p>
          <ol className="text-cg-light text-xs space-y-1 list-decimal list-inside">
            <li>Selecciona la trampa que quieres simular</li>
            <li>Elige el nivel de detección (baja, media o alta)</li>
            <li>Presiona el botón para enviar la detección</li>
            <li>La alerta aparecerá en la app principal</li>
          </ol>
        </div>

        {/* URL Info */}
        <div className="mt-4 bg-white/5 rounded-xl p-3">
          <p className="text-cg-light text-xs text-center">
            🔗 Ruta: <span className="text-cg-gold font-mono">/simulator</span>
          </p>
        </div>
      </div>
    </div>
  );
}
