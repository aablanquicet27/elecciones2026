import React, { useState, useEffect } from 'react';
import { X, Mail, CheckCircle, Loader, Vote } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: (email: string) => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose, onSubscribe }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValid(emailRegex.test(email));
    setError('');
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
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
        .single();

      if (!existingSubscription) {
        // Crear nueva suscripción
        const { error: insertError } = await supabase
          .from('subscriptions')
          .insert([{ email, active: true }]);

        if (insertError) throw insertError;
      }

      // Guardar en localStorage para no volver a mostrar
      localStorage.setItem('electoral_ai_subscribed', 'true');
      localStorage.setItem('electoral_ai_email', email);
      
      onSubscribe(email);
      onClose();
    } catch (err) {
      console.error('Error al suscribirse:', err);
      setError('Hubo un error al procesar tu suscripción. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-white/20 p-2 rounded-full">
              <Vote className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold">¡Bienvenido a ElectoralAI!</h2>
          </div>
          <p className="text-purple-100 text-sm">
            Análisis electoral inteligente para Colombia 2026
          </p>
        </div>

        {/* Content */}
        <div className="px-8 py-6">
          <p className="text-gray-700 mb-6 leading-relaxed">
            Para acceder a nuestros análisis electorales y participar en encuestas, 
            necesitamos tu correo electrónico:
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                required
              />
              {isValid && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500" />
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
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  <span>Procesando...</span>
                </>
              ) : (
                <span>Continuar</span>
              )}
            </button>
          </form>

          {/* Benefits */}
          <div className="mt-6 space-y-3">
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span>Recibirás reportes mensuales con análisis de IA</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span>Acceso a encuestas exclusivas</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span>Sin spam, solo contenido relevante</span>
            </div>
          </div>

          {/* Privacy */}
          <p className="text-xs text-gray-500 mt-6 text-center">
            * Al registrarte aceptas nuestra política de privacidad
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;