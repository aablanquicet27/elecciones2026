import React, { useState, useEffect } from 'react';
import { X, Mail, CheckCircle, Loader, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getCandidateImage } from '../utils/candidateImages';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: (email: string) => void;
}

// Lista de los 10 principales candidatos según encuesta Invamer Feb 2026
const mainCandidates = [
  'Abelardo de la Espriella',
  'Iván Cepeda',
  'Sergio Fajardo',
  'Paloma Valencia',
  'Claudia López',
  'Miguel Uribe Londoño',
  'Vicky Dávila',
  'Juan Daniel Oviedo',
  'Juan Carlos Pinzón',
  'Voto en Blanco'
];

// Lista completa de candidatos adicionales
const additionalCandidates = [
  'Daniel Quintero',
  'Camilo Romero',
  'Juan Manuel Galán',
  'Enrique Peñalosa',
  'Aníbal Gaviria',
  'Santiago Botero',
  'David Luna',
  'Roy Barreras',
  'Mauricio Cárdenas',
  'Paola Holguín',
  'Andrés Guerra Hoyos',
  'Juan Guillermo Zuluaga',
  'Maurice Armitage',
  'Juan Carlos Cárdenas',
  'Juan Carlos Saldarriaga',
  'Jaime Pumarejo',
  'Mauricio Lizcano',
  'Héctor Olimpo',
  'Alfredo Saade',
  'María José Pizarro',
  'Jota Pe Hernández',
  'Juan Fernando Cristo'
];

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose, onSubscribe }) => {
  const [step, setStep] = useState<'email' | 'vote'>('email');
  const [email, setEmail] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<string>('');
  const [showOthers, setShowOthers] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [shuffledCandidates, setShuffledCandidates] = useState<string[]>([]);

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

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isLoading) return;

    setIsLoading(true);
    setError('');

    try {
      // Verificar si el email ya existe
      const { data: existingSubscription, error: selectError } = await supabase
        .from('subscriptions')
        .select('email')
        .eq('email', email)
        .maybeSingle();

      if (!existingSubscription) {
        // Crear nueva suscripción
        const { error: insertError } = await supabase
          .from('subscriptions')
          .insert([{ email, active: true }]);

        if (insertError) throw insertError;
      }

      // Pasar al paso de votación
      setStep('vote');
    } catch (err) {
      console.error('Error al procesar email:', err);
      setError('Hubo un error al procesar tu email. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoteSubmit = async () => {
    if (!selectedCandidate || isLoading) return;

    setIsLoading(true);
    setError('');

    try {
      // Registrar el voto
      const { error: voteError } = await supabase
        .from('votes')
        .insert([{ 
          email, 
          candidate: selectedCandidate
        }]);

      if (voteError) throw voteError;

      // Guardar en localStorage
      localStorage.setItem('electoral_ai_subscribed', 'true');
      localStorage.setItem('electoral_ai_email', email);
      localStorage.setItem('electoral_ai_voted', 'true');
      localStorage.setItem('electoral_ai_vote', selectedCandidate);
      
      onSubscribe(email);
      onClose();
    } catch (err) {
      console.error('Error al registrar voto:', err);
      setError('Hubo un error al registrar tu voto. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
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
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          
          <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
            <img src="/logoagapai.png" alt="Logo" className="h-6 w-6 sm:h-8 sm:w-8 bg-white/20 rounded-full p-1" />
            <h2 className="text-xl sm:text-2xl font-bold">
              {step === 'email' ? '¡Únete a ElectoralAI!' : 'Encuesta Electoral 2026'}
            </h2>
          </div>
          <p className="text-purple-100 text-sm sm:text-base">
            {step === 'email' 
              ? 'Análisis electoral inteligente para Colombia 2026'
              : 'Si las elecciones fueran el día de hoy, ¿por quién votarías?'
            }
          </p>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 max-h-[70vh] overflow-y-auto">
          {step === 'email' ? (
            // Email Step
            <div>
              <p className="text-gray-700 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                Para acceder a nuestros análisis electorales y participar en encuestas, 
                necesitamos tu correo electrónico:
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
                    required
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

                <button
                  type="submit"
                  disabled={!isValid || isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base"
                >
                  {isLoading ? (
                    <>
                      <Loader className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                      <span>Procesando...</span>
                    </>
                  ) : (
                    <span>Continuar a la Encuesta</span>
                  )}
                </button>
              </form>

              {/* Benefits */}
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
          ) : (
            // Vote Step
            <div>
              <div className="mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                  Principales Candidatos
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Selecciona tu candidato preferido:
                </p>
              </div>

              {/* Grid de candidatos principales - Muy responsive */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-3 mb-4 sm:mb-6">
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
                        src={getCandidateImage(candidate, 120)}
                        alt={candidate}
                        className="w-full h-full object-cover"
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
                      {candidate.split(' ').slice(0, 2).join(' ')}
                    </p>
                  </button>
                ))}
              </div>

              {/* Botón para mostrar otros candidatos */}
              <div className="mb-4 sm:mb-6">
                <button
                  onClick={() => setShowOthers(!showOthers)}
                  className="w-full flex items-center justify-center space-x-2 py-2 sm:py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
                >
                  <span>Otros candidatos</span>
                  {showOthers ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>

                {/* Lista desplegable de otros candidatos */}
                {showOthers && (
                  <div className="mt-3 max-h-32 sm:max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
                    {additionalCandidates.map((candidate) => (
                      <button
                        key={candidate}
                        onClick={() => {
                          setSelectedCandidate(candidate);
                          setShowOthers(false);
                        }}
                        className={`w-full text-left px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 text-sm sm:text-base ${
                          selectedCandidate === candidate ? 'bg-purple-50 text-purple-700 font-medium' : 'text-gray-700'
                        }`}
                      >
                        {candidate}
                      </button>
                    ))}
                  </div>
                )}
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

              {/* Botones de acción */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={() => setStep('email')}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm sm:text-base"
                >
                  Volver
                </button>
                <button
                  onClick={handleVoteSubmit}
                  disabled={!selectedCandidate || isLoading}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base"
                >
                  {isLoading ? (
                    <>
                      <Loader className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <span>Enviar Voto</span>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Privacy */}
          <p className="text-xs text-gray-500 mt-4 sm:mt-6 text-center">
            * Al registrarte aceptas nuestra política de privacidad
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;