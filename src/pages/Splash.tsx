import { useState } from 'react';
import { Leaf } from 'lucide-react';
import { login, register, setToken } from '../services/api';

interface SplashProps {
  onEnter: () => void;
}

export default function Splash({ onEnter }: SplashProps) {
  const [mode, setMode] = useState<'welcome' | 'login' | 'register'>('welcome');
  const [name, setName] = useState('');
  const [farmName, setFarmName] = useState('');
  const [municipality, setMunicipality] = useState('');
  const [department, setDepartment] = useState('');
  const [hectares, setHectares] = useState('');
  const [cooperative, setCooperative] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Completa todos los campos');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await login(email.trim(), password);
      setToken(res.access_token);
      onEnter();
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !farmName.trim() || 
        !municipality.trim() || !department.trim() || !hectares.trim()) {
      setError('Completa todos los campos obligatorios');
      return;
    }
    
    const hectaresNum = parseFloat(hectares);
    if (isNaN(hectaresNum) || hectaresNum <= 0) {
      setError('Las hectáreas deben ser un número mayor a 0');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      const res = await register({
        name: name.trim(),
        email: email.trim(),
        password,
        farmName: farmName.trim(),
        municipality: municipality.trim(),
        department: department.trim(),
        hectares: hectaresNum,
        cooperative: cooperative.trim() || undefined,
      });
      setToken(res.access_token);
      onEnter();
    } catch (err: any) {
      setError(err.message || 'Error al registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-start px-8 bg-cg-cream relative overflow-y-auto">
      {/* Decorative circles */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-cg-light/20 rounded-full" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-cg-gold/15 rounded-full" />
      
      <div className="flex flex-col items-center z-10 mt-8">
        {/* Logo */}
        <div className="w-24 h-24 bg-cg-medium rounded-3xl flex items-center justify-center shadow-lg mb-4">
          <Leaf size={48} className="text-cg-gold" strokeWidth={2} />
        </div>
        
        <h1 className="text-2xl font-extrabold text-cg-dark mb-1 tracking-tight">
          Coffee Guard
        </h1>
        <p className="text-sm text-cg-medium/80 font-medium mb-6 text-center leading-snug">
          Protege tu cosecha<br/>de la broca del café
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="w-full bg-cg-red/10 border border-cg-red/20 rounded-xl px-4 py-3 mb-3 z-10">
          <p className="text-cg-red text-sm font-semibold text-center">{error}</p>
        </div>
      )}

      {mode === 'welcome' && (
        <div className="w-full flex flex-col gap-3 z-10">
          <button
            onClick={() => { setMode('login'); setError(''); }}
            className="w-full bg-cg-medium text-cg-white font-bold text-lg py-4 rounded-2xl shadow-md active:scale-[0.98] transition-transform"
          >
            Ingresar
          </button>
          <button
            onClick={() => { setMode('register'); setError(''); }}
            className="w-full bg-cg-white text-cg-medium font-bold text-lg py-4 rounded-2xl border-2 border-cg-medium shadow-sm active:scale-[0.98] transition-transform"
          >
            Registrarme
          </button>
        </div>
      )}

      {mode === 'login' && (
        <div className="w-full flex flex-col gap-3 z-10">
          <div className="bg-cg-white p-4 rounded-2xl shadow-sm border border-cg-cream mb-2">
            <label className="text-sm font-semibold text-cg-dark block mb-1">Correo electrónico</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ej: carlos@coffeeguard.co" 
              className="w-full bg-cg-cream/50 border border-cg-cream rounded-xl px-4 py-3 text-base text-cg-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cg-medium"
            />
            <label className="text-sm font-semibold text-cg-dark block mt-3 mb-1">Contraseña</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tu contraseña" 
              className="w-full bg-cg-cream/50 border border-cg-cream rounded-xl px-4 py-3 text-base text-cg-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cg-medium"
            />
          </div>
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-cg-medium text-cg-white font-bold text-lg py-4 rounded-2xl shadow-md active:scale-[0.98] transition-transform disabled:opacity-60"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
          <button
            onClick={() => { setMode('welcome'); setError(''); }}
            className="w-full bg-transparent text-cg-medium font-semibold text-base py-2"
          >
            Volver
          </button>
        </div>
      )}

      {mode === 'register' && (
        <div className="w-full flex flex-col gap-3 z-10 mb-8">
          <div className="bg-cg-white p-4 rounded-2xl shadow-sm border border-cg-cream mb-2 max-h-[60vh] overflow-y-auto">
            <label className="text-sm font-semibold text-cg-dark block mb-1">Tu nombre *</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Carlos Mora" 
              className="w-full bg-cg-cream/50 border border-cg-cream rounded-xl px-4 py-3 text-base text-cg-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cg-medium"
            />
            
            <label className="text-sm font-semibold text-cg-dark block mt-3 mb-1">Correo electrónico *</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ej: carlos@email.com" 
              className="w-full bg-cg-cream/50 border border-cg-cream rounded-xl px-4 py-3 text-base text-cg-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cg-medium"
            />
            
            <label className="text-sm font-semibold text-cg-dark block mt-3 mb-1">Contraseña *</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres" 
              className="w-full bg-cg-cream/50 border border-cg-cream rounded-xl px-4 py-3 text-base text-cg-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cg-medium"
            />
            
            <label className="text-sm font-semibold text-cg-dark block mt-3 mb-1">Nombre de la finca *</label>
            <input 
              type="text" 
              value={farmName}
              onChange={(e) => setFarmName(e.target.value)}
              placeholder="Ej: La Esperanza" 
              className="w-full bg-cg-cream/50 border border-cg-cream rounded-xl px-4 py-3 text-base text-cg-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cg-medium"
            />
            
            <label className="text-sm font-semibold text-cg-dark block mt-3 mb-1">Municipio *</label>
            <input 
              type="text" 
              value={municipality}
              onChange={(e) => setMunicipality(e.target.value)}
              placeholder="Ej: Pitalito" 
              className="w-full bg-cg-cream/50 border border-cg-cream rounded-xl px-4 py-3 text-base text-cg-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cg-medium"
            />
            
            <label className="text-sm font-semibold text-cg-dark block mt-3 mb-1">Departamento *</label>
            <input 
              type="text" 
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="Ej: Huila" 
              className="w-full bg-cg-cream/50 border border-cg-cream rounded-xl px-4 py-3 text-base text-cg-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cg-medium"
            />
            
            <label className="text-sm font-semibold text-cg-dark block mt-3 mb-1">Hectáreas *</label>
            <input 
              type="number" 
              step="0.1"
              value={hectares}
              onChange={(e) => setHectares(e.target.value)}
              placeholder="Ej: 4.5" 
              className="w-full bg-cg-cream/50 border border-cg-cream rounded-xl px-4 py-3 text-base text-cg-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cg-medium"
            />
            
            <label className="text-sm font-semibold text-cg-dark block mt-3 mb-1">Cooperativa (opcional)</label>
            <input 
              type="text" 
              value={cooperative}
              onChange={(e) => setCooperative(e.target.value)}
              placeholder="Ej: Cooperativa Cafetera del Huila" 
              className="w-full bg-cg-cream/50 border border-cg-cream rounded-xl px-4 py-3 text-base text-cg-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cg-medium"
            />
            
            <p className="text-xs text-gray-500 mt-3">* Campos obligatorios</p>
          </div>
          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-cg-medium text-cg-white font-bold text-lg py-4 rounded-2xl shadow-md active:scale-[0.98] transition-transform disabled:opacity-60"
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
          <button
            onClick={() => { setMode('welcome'); setError(''); }}
            className="w-full bg-transparent text-cg-medium font-semibold text-base py-2"
          >
            Volver
          </button>
        </div>
      )}
    </div>
  );
}
