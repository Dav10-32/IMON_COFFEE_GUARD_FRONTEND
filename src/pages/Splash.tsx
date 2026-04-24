import { useState } from 'react';
import { Leaf } from 'lucide-react';

interface SplashProps {
  onEnter: (name?: string, farmName?: string) => void;
}

export default function Splash({ onEnter }: SplashProps) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [farmName, setFarmName] = useState('');

  const handleCreateAccount = () => {
    if (name.trim()) {
      onEnter(name.trim(), farmName.trim() || 'Mi Finca');
    } else {
      onEnter();
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 bg-cg-cream relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-cg-light/20 rounded-full" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-cg-gold/15 rounded-full" />
      
      <div className="flex flex-col items-center z-10">
        {/* Logo */}
        <div className="w-28 h-28 bg-cg-medium rounded-3xl flex items-center justify-center shadow-lg mb-6">
          <Leaf size={56} className="text-cg-gold" strokeWidth={2} />
        </div>
        
        <h1 className="text-3xl font-extrabold text-cg-dark mb-1 tracking-tight">
          Coffee Guard
        </h1>
        <p className="text-base text-cg-medium/80 font-medium mb-10 text-center leading-snug">
          Protege tu cosecha<br/>de la broca del café
        </p>
      </div>

      {!showForm ? (
        <div className="w-full flex flex-col gap-3 z-10">
          <button
            onClick={() => onEnter()}
            className="w-full bg-cg-medium text-cg-white font-bold text-lg py-4 rounded-2xl shadow-md active:scale-[0.98] transition-transform"
          >
            Ingresar
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="w-full bg-cg-white text-cg-medium font-bold text-lg py-4 rounded-2xl border-2 border-cg-medium shadow-sm active:scale-[0.98] transition-transform"
          >
            Registrarme
          </button>
        </div>
      ) : (
        <div className="w-full flex flex-col gap-3 z-10">
          <div className="bg-cg-white p-4 rounded-2xl shadow-sm border border-cg-cream mb-2">
            <label className="text-sm font-semibold text-cg-dark block mb-1">Tu nombre</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Carlos Mora" 
              className="w-full bg-cg-cream/50 border border-cg-cream rounded-xl px-4 py-3 text-base text-cg-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cg-medium"
            />
            <label className="text-sm font-semibold text-cg-dark block mt-3 mb-1">Nombre de la finca</label>
            <input 
              type="text" 
              value={farmName}
              onChange={(e) => setFarmName(e.target.value)}
              placeholder="Ej: La Esperanza" 
              className="w-full bg-cg-cream/50 border border-cg-cream rounded-xl px-4 py-3 text-base text-cg-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cg-medium"
            />
          </div>
          <button
            onClick={handleCreateAccount}
            className="w-full bg-cg-medium text-cg-white font-bold text-lg py-4 rounded-2xl shadow-md active:scale-[0.98] transition-transform"
          >
            Crear cuenta
          </button>
          <button
            onClick={() => setShowForm(false)}
            className="w-full bg-transparent text-cg-medium font-semibold text-base py-2"
          >
            Volver
          </button>
        </div>
      )}
    </div>
  );
}
