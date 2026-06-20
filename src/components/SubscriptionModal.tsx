import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { X, Mail, CheckCircle, Loader, Vote } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getCandidateImage } from '../utils/candidateImages';

const AVATAR_BASE = 'https://ui-avatars.com/api/';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: (email: string) => void;
}

// Segunda vuelta (balotaje 21 jun 2026): solo los dos finalistas
const mainCandidates = [
  'Abelardo de la Espriella',
  'Iván Cepeda'
];

// Fallback global por si una imagen falla en cargar (ej. 404 o caché viejo)
const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>, candidate: string) => {
  const target = e.currentTarget;
  if (target.dataset.fallback === 'true') return;
  target.dataset.fallback = 'true';
  const safeName = encodeURIComponent(candidate);
  target.src = `${AVATAR_BASE}?name=${safeName}&size=200&background=7c3aed&color=ffffff&bold=true&format=png`;
};

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose, onSubscribe }) => {
  const dark = useLocation().pathname === '/ia';
  // Flujo invertido: primero votar, luego correo opcional
  const [step, setStep] = useState<'vote' | 'email'>('vote');
  const [email, setEmail] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [shuffledCandidates, setShuffledCandidates] = useState<string[]>([]);
  const [voteId, setVoteId] = useState<string | null>(null);

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValid(emailRegex.test(email));
    setError('');
  }, [email]);

  useEffect(() => {
    const shuffleArray = (array: string[]) => {
      let currentIndex = array.length, randomIndex;
      const newArray = [...array];
      while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [newArray[currentIndex], newArray[randomIndex]] = [
          newArray[randomIndex], newArray[currentIndex]];
      }
      return newArray;
    };
    setShuffledCandidates(shuffleArray(mainCandidates));
  }, []);

  // PASO 1: Registrar voto anónimo (sin correo) y avanzar al paso de correo
  const handleVoteSubmit = async () => {
    if (!selectedCandidate || isLoading) return;

    setIsLoading(true);
    setError('');

    try {
      const { data, error: voteError } = await supabase
        .from('votes')
        .insert([{
          email: null,
          candidate: selectedCandidate
        }])
        .select('id')
        .single();

      if (voteError) throw voteError;

      if (data && data.id) {
        setVoteId(String(data.id));
      }

      // Guardar voto en localStorage
      localStorage.setItem('electoral_ai_voted', 'true');
      localStorage.setItem('electoral_ai_vote', selectedCandidate);

      // Avanzar al paso de correo (opcional)
      setStep('email');
    } catch (err) {
      console.error('Error al registrar voto:', err);
      setError('Hubo un error al registrar tu voto. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  // PASO 2: Agregar correo (suscripción) y vincularlo al voto previo
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isLoading) return;

    setIsLoading(true);
    setError('');

    try {
      // Verificar si el email ya existe
      const { data: existingSubscription } = await supabase
        .from('subscriptions')
        .select('email')
        .eq('email', email)
        .maybeSingle();

      if (!existingSubscription) {
        const { error: insertError } = await supabase
          .from('subscriptions')
          .insert([{ email, active: true }]);

        if (insertError) throw insertError;
      }

      // Vincular el voto previo con el correo (best-effort)
      if (voteId) {
        await supabase
          .from('votes')
          .update({ email })
          .eq('id', voteId);
      }

      localStorage.setItem('electoral_ai_subscribed', 'true');
      localStorage.setItem('electoral_ai_email', email);

      onSubscribe(email);
      onClose();
    } catch (err) {
      console.error('Error al procesar email:', err);
      setError('Hubo un error al procesar tu correo. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  // Cerrar saltando el correo: el voto ya quedó registrado
  const handleSkipEmail = () => {
    onSubscribe('');
    onClose();
  };

  if (!isOpen) return null;

  const grad = dark ? 'bg-gradient-to-r from-[#4C8DFF] to-[#FF4D6D] hover:opacity-90' : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700';
  const panel = dark ? 'bg-[#0A0C12] border border-white/10' : 'bg-white';
  const headBg = dark ? 'bg-[#10131c]' : 'bg-gradient-to-r from-purple-600 to-indigo-600';
  const tStrong = dark ? 'text-slate-100' : 'text-gray-900';
  const tSoft = dark ? 'text-slate-400' : 'text-gray-600';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className={`relative rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden ${panel}`}>
        {/* Franja tricolor (solo en /ia) */}
        {dark && (
          <div className="h-1 w-full flex">
            <div className="flex-[2]" style={{ background: '#FCD116' }} />
            <div className="flex-1" style={{ background: '#003893' }} />
            <div className="flex-1" style={{ background: '#CE1126' }} />
          </div>
        )}

        {/* Header */}
        <div className={`${headBg} px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-white relative`}>
          <button onClick={onClose} className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 hover:bg-white/20 rounded-full transition-colors" aria-label="Cerrar">
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
            <img src="/logoagapai.png" alt="Logo" className="h-6 w-6 sm:h-8 sm:w-8 bg-white/20 rounded-full p-1" />
            <h2 className="text-xl sm:text-2xl font-bold">
              {step === 'vote' ? 'Encuesta Electoral 2026' : '¡Listo, tu voto fue registrado!'}
            </h2>
          </div>
          <p className={dark ? 'text-slate-300 text-sm sm:text-base' : 'text-purple-100 text-sm sm:text-base'}>
            {step === 'vote'
              ? 'En la segunda vuelta del 21 de junio, ¿por quién votarías?'
              : 'Déjanos tu correo (opcional) y recibe el análisis electoral con IA.'}
          </p>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 max-h-[70vh] overflow-y-auto">
          {step === 'vote' ? (
            <div>
              <div className="mb-4 sm:mb-6">
                <h3 className={`text-lg sm:text-xl font-bold mb-2 ${tStrong}`}>Balotaje · 21 de junio de 2026</h3>
                <p className={`text-sm sm:text-base ${tSoft}`}>Elige tu candidato para la segunda vuelta:</p>
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-4 sm:mb-6">
                {shuffledCandidates.map((candidate) => {
                  const sel = selectedCandidate === candidate;
                  return (
                    <button key={candidate} onClick={() => setSelectedCandidate(candidate)}
                      className={`relative group transition-all duration-200 ${sel ? (dark ? 'ring-2 ring-[#4C8DFF] ring-offset-2 ring-offset-[#0A0C12] rounded-xl' : 'ring-2 ring-purple-500 ring-offset-2') : 'hover:scale-105'}`}>
                      <div className={`aspect-square rounded-lg sm:rounded-xl overflow-hidden ${dark ? 'bg-white/5' : 'bg-gray-100'}`}>
                        <img src={getCandidateImage(candidate, 200)} alt={candidate} loading="lazy" className="w-full h-full object-cover" onError={(e) => handleImageError(e, candidate)} />
                      </div>
                      <div className={`absolute inset-0 rounded-lg sm:rounded-xl transition-all duration-200 ${sel ? (dark ? 'bg-[#4C8DFF]/20 border-2 border-[#4C8DFF]' : 'bg-purple-600/20 border-2 border-purple-500') : 'bg-black/0 group-hover:bg-black/10'}`}>
                        {sel && (
                          <div className="absolute top-1 right-1">
                            <CheckCircle className={`h-4 w-4 sm:h-5 sm:w-5 bg-white rounded-full ${dark ? 'text-[#4C8DFF]' : 'text-purple-600'}`} />
                          </div>
                        )}
                      </div>
                      <p className={`text-xs sm:text-sm font-medium mt-1 sm:mt-2 text-center leading-tight ${dark ? 'text-slate-200' : 'text-gray-900'}`}>{candidate}</p>
                    </button>
                  );
                })}
              </div>

              {selectedCandidate && (
                <div className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg border ${dark ? 'bg-[#10131c] border-white/10' : 'bg-purple-50 border-purple-200'}`}>
                  <p className={`text-sm sm:text-base ${dark ? 'text-slate-200' : 'text-purple-800'}`}><strong>Candidato seleccionado:</strong> {selectedCandidate}</p>
                </div>
              )}

              {error && <div className={`text-sm p-3 rounded-lg mb-4 ${dark ? 'bg-red-500/10 text-red-300 border border-red-500/30' : 'text-red-600 bg-red-50'}`}>{error}</div>}

              <button onClick={handleVoteSubmit} disabled={!selectedCandidate || isLoading}
                className={`w-full text-white py-3 px-6 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base ${grad}`}>
                {isLoading ? (<><Loader className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" /><span>Registrando voto...</span></>) : (<><Vote className="h-4 w-4 sm:h-5 sm:w-5" /><span>Enviar mi Voto</span></>)}
              </button>
              <p className={`text-xs mt-3 text-center ${dark ? 'text-slate-500' : 'text-gray-500'}`}>Tu voto es anónimo. Después podrás suscribirte si quieres recibir análisis.</p>
            </div>
          ) : (
            <div>
              <div className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg border flex items-start space-x-3 ${dark ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-green-50 border-green-200'}`}>
                <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className={`text-sm sm:text-base font-semibold ${dark ? 'text-emerald-200' : 'text-green-800'}`}>Tu voto por <strong>{selectedCandidate}</strong> fue registrado.</p>
                  <p className={`text-xs sm:text-sm mt-1 ${dark ? 'text-emerald-300/80' : 'text-green-700'}`}>Gracias por participar. ¿Quieres recibir el análisis electoral con IA?</p>
                </div>
              </div>

              <p className={`mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base ${dark ? 'text-slate-300' : 'text-gray-700'}`}>Déjanos tu correo (opcional) para enviarte reportes con análisis y encuestas exclusivas.</p>

              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className={`h-4 w-4 sm:h-5 sm:w-5 ${dark ? 'text-slate-500' : 'text-gray-400'}`} />
                  </div>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-200 text-sm sm:text-base outline-none ${
                      dark ? 'bg-[#10131c] text-slate-100 placeholder-slate-500 border-white/15 focus:ring-2 focus:ring-[#4C8DFF]/30 focus:border-[#4C8DFF]' : 'border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                    }`} />
                  {isValid && <div className="absolute inset-y-0 right-0 pr-3 flex items-center"><CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500" /></div>}
                </div>

                {error && <div className={`text-sm p-3 rounded-lg ${dark ? 'bg-red-500/10 text-red-300 border border-red-500/30' : 'text-red-600 bg-red-50'}`}>{error}</div>}

                <div className="flex flex-col sm:flex-row gap-3">
                  <button type="button" onClick={handleSkipEmail}
                    className={`flex-1 py-3 px-6 rounded-xl font-medium transition-colors text-sm sm:text-base ${dark ? 'border border-white/15 text-slate-300 hover:bg-white/5' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                    No, gracias
                  </button>
                  <button type="submit" disabled={!isValid || isLoading}
                    className={`flex-1 text-white py-3 px-6 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base ${grad}`}>
                    {isLoading ? (<><Loader className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" /><span>Suscribiendo...</span></>) : (<span>Suscribirme</span>)}
                  </button>
                </div>
              </form>

              <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
                {['Recibirás reportes con análisis de IA', 'Acceso a encuestas exclusivas', 'Sin spam, solo contenido relevante'].map((b) => (
                  <div key={b} className={`flex items-center space-x-3 text-xs sm:text-sm ${dark ? 'text-slate-400' : 'text-gray-600'}`}>
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500 flex-shrink-0" /><span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className={`text-xs mt-4 sm:mt-6 text-center ${dark ? 'text-slate-600' : 'text-gray-500'}`}>* Al registrarte aceptas nuestra política de privacidad</p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;
