import React, { useState, useEffect } from 'react';
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
            <img src="/logoagapai.png" alt="Logo" className="h-6 w-6 sm:h-8 sm:w-8 bg-white/20 rounded-full p-1" />
            <h2 className="text-xl sm:text-2xl font-bold">
              {step === 'vote' ? 'Encuesta Electoral 2026' : '¡Listo, tu voto fue registrado!'}
            </h2>
          </div>
          <p className="text-purple-100 text-sm sm:text-base">
            {step === 'vote'
              ? 'En la segunda vuelta del 21 de junio, ¿por quién votarías?'
              : 'Déjanos tu correo (opcional) y recibe el análisis electoral con IA.'
            }
          </p>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 max-h-[70vh] overflow-y-auto">
          {step === 'vote' ? (
            // PASO 1: Votar
            <div>
              <div className="mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                  Balotaje · 21 de junio de 2026
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Elige tu candidato para la segunda vuelta:
                </p>
              </div>

              {/* Grid de candidatos principales */}
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-4 sm:mb-6">
                {shuffledCandidates.map((candidate) => (
                  <button
                    key={candidate}
                    onClick={() => setSelectedCandidate(candidate)}
                    className={`relative group transition-all duration-200 ${
                      selectedCandidate === candidate
                        ? 'ring-2 ring-purple-500 ring-offset-2'
                        : 'hover:scale-105'
                    }`}
                  >
                    <div className="aspect-square rounded-lg sm:rounded-xl overflow-hidden bg-gray-100">
                      <img
                        src={getCandidateImage(candidate, 200)}
                        alt={candidate}
                        loading="lazy"
                        className="w-full h-full object-cover"
                        onError={(e) => handleImageError(e, candidate)}
                      />
                    </div>
                    <div className={`absolute inset-0 rounded-lg sm:rounded-xl transition-all duration-200 ${
                      selectedCandidate === candidate
                        ? 'bg-purple-600/20 border-2 border-purple-500'
                        : 'bg-black/0 group-hover:bg-black/10'
                    }`}>
                      {selectedCandidate === candidate && (
                        <div className="absolute top-1 right-1">
                          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 bg-white rounded-full" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-gray-900 mt-1 sm:mt-2 text-center leading-tight">
                      {candidate}
                    </p>
                  </button>
                ))}
              </div>

              {/* Candidato seleccionado */}
              {selectedCandidate && (
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-sm sm:text-base text-purple-800">
                    <strong>Candidato seleccionado:</strong> {selectedCandidate}
                  </p>
                </div>
              )}

              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg mb-4">
                  {error}
                </div>
              )}

              {/* Botón principal: votar */}
              <button
                onClick={handleVoteSubmit}
                disabled={!selectedCandidate || isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                {isLoading ? (
                  <>
                    <Loader className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                    <span>Registrando voto...</span>
                  </>
                ) : (
                  <>
                    <Vote className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>Enviar mi Voto</span>
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 mt-3 text-center">
                Tu voto es anónimo. Después podrás suscribirte si quieres recibir análisis.
              </p>
            </div>
          ) : (
            // PASO 2: Correo opcional
            <div>
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200 flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm sm:text-base text-green-800 font-semibold">
                    Tu voto por <strong>{selectedCandidate}</strong> fue registrado.
                  </p>
                  <p className="text-xs sm:text-sm text-green-700 mt-1">
                    Gracias por participar. ¿Quieres recibir el análisis electoral con IA?
                  </p>
                </div>
              </div>

              <p className="text-gray-700 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                Déjanos tu correo (opcional) para enviarte reportes mensuales con análisis y encuestas exclusivas.
              </p>

              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 text-sm sm:text-base"
                  />
                  {isValid && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                    </div>
                  )}
                </div>

                {error && (
                  <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                    {error}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={handleSkipEmail}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-50 transition-colors text-sm sm:text-base"
                  >
                    No, gracias
                  </button>
                  <button
                    type="submit"
                    disabled={!isValid || isLoading}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base"
                  >
                    {isLoading ? (
                      <>
                        <Loader className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                        <span>Suscribiendo...</span>
                      </>
                    ) : (
                      <span>Suscribirme</span>
                    )}
                  </button>
                </div>
              </form>

              {/* Beneficios */}
              <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
                <div className="flex items-center space-x-3 text-xs sm:text-sm text-gray-600">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                  <span>Recibirás reportes mensuales con análisis de IA</span>
                </div>
                <div className="flex items-center space-x-3 text-xs sm:text-sm text-gray-600">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                  <span>Acceso a encuestas exclusivas</span>
                </div>
                <div className="flex items-center space-x-3 text-xs sm:text-sm text-gray-600">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                  <span>Sin spam, solo contenido relevante</span>
                </div>
              </div>
            </div>
          )}

          <p className="text-xs text-gray-500 mt-4 sm:mt-6 text-center">
            * Al registrarte aceptas nuestra política de privacidad
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;
