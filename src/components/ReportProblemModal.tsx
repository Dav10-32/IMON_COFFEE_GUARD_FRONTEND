import { useState } from 'react';
import { X, MessageCircle, Send, CheckCircle2 } from 'lucide-react';
import { createReport } from '../services/api';

interface ReportProblemModalProps {
  trapName: string;
  trapId: string;
  onClose: () => void;
}

export default function ReportProblemModal({ trapName, trapId, onClose }: ReportProblemModalProps) {
  const [problem, setProblem] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!problem.trim()) return;
    setLoading(true);
    setError('');
    try {
      await createReport({
        trapId,
        trapName,
        description: problem.trim(),
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setProblem('');
        onClose();
      }, 1800);
    } catch (err: any) {
      setError(err.message || 'Error al enviar el reporte');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 z-[100] flex items-end justify-center bg-black/50">
      <div className="w-full bg-cg-cream rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300">
        {submitted ? (
          <div className="flex flex-col items-center justify-center px-6 pt-10 pb-12">
            <div className="w-16 h-16 bg-cg-green rounded-2xl flex items-center justify-center mb-4">
              <CheckCircle2 size={32} className="text-white" />
            </div>
            <h3 className="text-xl font-extrabold text-cg-dark text-center">Reporte enviado</h3>
            <p className="text-gray-500 text-sm text-center mt-2 font-medium">
              Nuestro equipo te contactará pronto
            </p>
          </div>
        ) : (
          <>
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-cg-yellow/15 rounded-lg flex items-center justify-center">
                  <MessageCircle size={16} className="text-cg-yellow" />
                </div>
                <h3 className="text-cg-dark font-bold text-base">Reportar problema</h3>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center active:bg-gray-300 transition-colors"
              >
                <X size={16} className="text-gray-600" />
              </button>
            </div>

            {/* Content */}
            <div className="px-5 pb-6">
              <p className="text-sm text-gray-600 font-medium mb-3">
                Trampa: <span className="font-bold text-cg-dark">{trapName}</span>
              </p>

              {error && (
                <div className="bg-cg-red/10 border border-cg-red/20 rounded-xl px-4 py-2 mb-3">
                  <p className="text-cg-red text-sm font-semibold">{error}</p>
                </div>
              )}

              <textarea
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="Describe el problema que tienes con esta trampa... Ej: No enciende, no detecta brocas, se desconecta mucho, etc."
                className="w-full bg-white border-2 border-cg-cream rounded-xl px-4 py-3 text-base text-cg-dark placeholder:text-gray-400 focus:outline-none focus:border-cg-medium min-h-[100px] resize-none"
              />

              <button
                onClick={handleSubmit}
                disabled={!problem.trim() || loading}
                className="w-full mt-4 bg-cg-medium text-cg-white font-bold text-lg py-4 rounded-2xl shadow-md active:scale-[0.98] transition-transform flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={20} />
                {loading ? 'Enviando...' : 'Enviar reporte'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
