import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Minimize2, ChevronDown, Bot } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const AIChatBubble: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hola, soy tu asistente electoral para Colombia 2026. ¿En qué puedo ayudarte hoy?',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // Simulate AI typing
    setIsTyping(true);
    
    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponses = [
        "Según las encuestas actuales, Gustavo Bolívar lidera con un 12.6% de intención de voto, seguido por Vicky Dávila con 11.6% y Sergio Fajardo con 11.4%.",
        "Las elecciones presidenciales de Colombia 2026 se caracterizarán por una alta fragmentación electoral. Ningún candidato supera el 15% de intención de voto.",
        "La región Caribe muestra una preferencia por candidatos de izquierda, mientras que la Orinoquía favorece a candidatos de derecha.",
        "Los jóvenes entre 18-24 años favorecen a Bolívar (18.5%), mientras los adultos mayores prefieren a Dávila (14.2%).",
        "El centro político ha mantenido estabilidad relativa, con una ligera caída de 1.2 puntos respecto a 2022.",
        "Puedes consultar el perfil completo de cada candidato haciendo clic en su tarjeta en la página principal.",
        "La presencia digital es un factor determinante en estas elecciones. Vicky Dávila lidera con 3.6M de seguidores en redes sociales."
      ];
      
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      
      const aiMessage: Message = {
        id: Date.now().toString(),
        content: randomResponse,
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  if (!isOpen) {
    return (
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-r from-purple-700 to-purple-900 text-white shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-300 z-50"
        aria-label="Abrir chat"
      >
        <MessageSquare className="w-7 h-7" />
      </button>
    );
  }

  return (
    <div 
      className={`fixed ${isMobile ? 'inset-0' : 'bottom-6 right-6 w-96 h-[500px]'} bg-[#F7F0E8] rounded-lg shadow-2xl flex flex-col overflow-hidden z-50 transition-all duration-300`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-900 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-full">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold">Asistente Electoral</h3>
            <p className="text-xs text-purple-200">Colombia 2026</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {!isMobile && (
            <button 
              onClick={() => setIsOpen(false)} 
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Minimizar"
            >
              <Minimize2 className="w-5 h-5" />
            </button>
          )}
          <button 
            onClick={toggleChat} 
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Cerrar"
          >
            {isMobile ? <ChevronDown className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </button>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-lg p-3 ${
                message.sender === 'user' 
                  ? 'bg-purple-600 text-white rounded-tr-none' 
                  : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-purple-200' : 'text-gray-500'}`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 text-gray-800 rounded-lg rounded-tl-none p-3 max-w-[80%]">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Escribe tu pregunta sobre las elecciones..."
            className="flex-1 border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-2 rounded-full hover:shadow-md transition-all duration-200"
            disabled={!inputValue.trim()}
            aria-label="Enviar"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-2 text-center">
          <p className="text-xs text-gray-500">Desarrollado por <a href="https://brochure.agapai.com.co" className="text-purple-600 hover:underline">AGAPAI</a></p>
        </div>
      </form>
    </div>
  );
};

export default AIChatBubble;