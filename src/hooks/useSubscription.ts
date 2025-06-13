import { useState, useEffect } from 'react';

export const useSubscription = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Verificar si ya está suscrito en localStorage
    const subscribed = localStorage.getItem('electoral_ai_subscribed');
    const email = localStorage.getItem('electoral_ai_email');
    
    if (subscribed === 'true' && email) {
      setIsSubscribed(true);
      setUserEmail(email);
    } else {
      // Mostrar modal después de un pequeño delay para mejor UX
      const timer = setTimeout(() => {
        setShowModal(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubscribe = (email: string) => {
    setIsSubscribed(true);
    setUserEmail(email);
    setShowModal(false);
    localStorage.setItem('electoral_ai_subscribed', 'true');
    localStorage.setItem('electoral_ai_email', email);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    // Opcional: mostrar de nuevo después de un tiempo si no se suscribe
    setTimeout(() => {
      if (!isSubscribed) {
        setShowModal(true);
      }
    }, 30000); // 30 segundos
  };

  return {
    isSubscribed,
    userEmail,
    showModal,
    handleSubscribe,
    handleCloseModal
  };
};