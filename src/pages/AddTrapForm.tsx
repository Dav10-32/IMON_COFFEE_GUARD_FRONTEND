import { useState } from 'react';
import { ArrowLeft, Plus, MapPin, CheckCircle2 } from 'lucide-react';
import { createTrap } from '../services/api';

interface AddTrapFormProps {
  onBack: () => void;
  onAddTrap: () => void;
}

export default function AddTrapForm({ onBack, onAddTrap }: AddTrapFormProps) {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!name.trim() || !location.trim()) return;

    setLoading(true);
    setError('');
    try {
      await createTrap({ name: name.trim(), location: location.trim() });
      onAddTrap();
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setName('');
        setLocation('');
        onBack();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Error al crear la trampa');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-cg-cream px-8">
        <div className="w-20 h-20 bg-cg-green rounded-3xl flex items-center justify-center mb-4 animate-bounce">
          <CheckCircle2 size={40} className="text-white" />
        </div>
        <h2 className="text-2xl font-extrabold text-cg-dark text-center">¡Trampa agregada!</h2>
        <p className="text-gray-500 text-center mt-2 font-medium">Ya está lista para monitorear tu cultivo</p>
      </div>
    );
  }

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
          <h2 className="text-cg-cream text-lg font-extrabold">Agregar Trampa</h2>
          <p className="text-cg-light text-xs font-medium">Registra una nueva trampa IoT</p>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
          <div className="flex flex-col gap-5">
            {error && (
              <div className="bg-cg-red/10 border border-cg-red/20 rounded-xl px-4 py-3">
                <p className="text-cg-red text-sm font-semibold">{error}</p>
              </div>
            )}

            <div>
              <label className="text-sm font-bold text-cg-dark block mb-2">
                Nombre de la trampa
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Trampa N°4"
                className="w-full bg-cg-cream/50 border-2 border-cg-cream rounded-xl px-4 py-4 text-base text-cg-dark placeholder:text-gray-400 focus:outline-none focus:border-cg-medium focus:ring-1 focus:ring-cg-medium transition-colors"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-cg-dark block mb-2">
                Ubicación en la finca
              </label>
              <div className="relative">
                <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ej: Lote Norte - Cerca del portón"
                  className="w-full bg-cg-cream/50 border-2 border-cg-cream rounded-xl pl-11 pr-4 py-4 text-base text-cg-dark placeholder:text-gray-400 focus:outline-none focus:border-cg-medium focus:ring-1 focus:ring-cg-medium transition-colors"
                />
              </div>
              <p className="text-xs text-gray-400 mt-2 font-medium">
                Escribe una referencia que te ayude a encontrarla fácilmente
              </p>
            </div>

            <div className="bg-cg-cream/60 rounded-xl p-4">
              <p className="text-sm font-bold text-cg-dark mb-1">¿Cómo conectar mi trampa?</p>
              <p className="text-xs text-gray-600 leading-relaxed">
                1. Enciende la trampa con el botón lateral<br />
                2. Espera 2 minutos a que se conecte a la red<br />
                3. La app la detectará automáticamente
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!name.trim() || !location.trim() || loading}
          className="w-full bg-cg-medium text-cg-white font-bold text-lg py-4 rounded-2xl shadow-md active:scale-[0.98] transition-transform flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={22} />
          {loading ? 'Guardando...' : 'Guardar trampa'}
        </button>

        <button
          onClick={onBack}
          className="w-full bg-transparent text-cg-medium font-semibold text-base py-3 mt-2"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
