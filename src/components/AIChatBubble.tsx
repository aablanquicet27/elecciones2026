import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SYSTEM_CONTEXT = 'Eres un asistente de análisis político especializado en las elecciones presidenciales de Colombia 2026. Proporciona información basada en datos, análisis objetivo y contexto electoral relevante.';

const AIChatBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '¡Hola! Soy tu asistente de análisis electoral. Puedo ayudarte con información sobre los candidatos, tendencias electorales y análisis político de Colombia 2026. ¿En qué puedo ayudarte?'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const callDigitalOceanAgent = async (userMessage: string) => {
    try {
      const endpoint = import.meta.env.VITE_DO_AGENT_ENDPOINT;
      const accessKey = import.meta.env.VITE_DO_AGENT_ACCESS_KEY;

      if (!endpoint || !accessKey) {
        console.warn('⚠️ Digital Ocean Agent no configurado. Mostrando respuesta de demostración.');
        return 'Gracias por tu pregunta sobre las elecciones en Colombia 2026. Para activar el asistente de IA completo, configura las credenciales de Digital Ocean Agent. Mientras tanto, puedes explorar los datos y análisis disponibles en la aplicación.';
      }

      // Construir el historial de mensajes para el contexto
      const conversationHistory = messages
        .filter(m => m.role !== 'assistant' || m.content !== messages[0].content) // Excluir mensaje de bienvenida
        .map(m => ({
          role: m.role,
          content: m.content
        }));

      // Digital Ocean AI Agents API - el endpoint correcto NO incluye /chat/completions
      // La URL debe ser directamente la del agent: https://[agent-id].agents.do-ai.run
      const response = await axios.post(
        endpoint, // Sin /chat/completions
        {
          messages: [
            { role: 'system', content: SYSTEM_CONTEXT },
            ...conversationHistory,
            { role: 'user', content: userMessage }
          ],
          max_tokens: 500,
          temperature: 0.7,
          stream: false
        },
        {
          headers: {
            'Authorization': `Bearer ${accessKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: 30000 // 30 segundos timeout
        }
      );

      // Digital Ocean puede devolver diferentes formatos
      const agentMessage = 
        response.data?.choices?.[0]?.message?.content || 
        response.data?.response || 
        response.data?.message ||
        'Lo siento, no pude procesar tu mensaje.';
      
      return agentMessage;
    } catch (error: any) {
      console.error('❌ Error communicating with DigitalOcean Agent:', error);
      
      if (error.response) {
        console.error('Error response:', error.response.data);
        const status = error.response.status;
        
        if (status === 404) {
          return '⚠️ El endpoint del agente de IA no es válido. Verifica que la URL del agente en VITE_DO_AGENT_ENDPOINT sea correcta y NO incluya /chat/completions al final.';
        } else if (status === 401 || status === 403) {
          return '🔐 La clave de acceso es inválida o ha expirado. Verifica tu VITE_DO_AGENT_ACCESS_KEY.';
        } else if (status === 429) {
          return '⏱️ Has alcanzado el límite de solicitudes. Por favor, espera un momento e intenta de nuevo.';
        } else {
          return `Error del servidor (${status}). Por favor, intenta más tarde.`;
        }
      } else if (error.request) {
        return '📡 No se pudo conectar con el servicio de IA. Verifica tu conexión a internet.';
      } else if (error.code === 'ECONNABORTED') {
        return '⏱️ La solicitud tomó demasiado tiempo. Por favor, intenta de nuevo.';
      } else {
        return `Error: ${error.message}`;
      }
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    
    // Agregar mensaje del usuario
    const newUserMessage: Message = { role: 'user', content: userMessage };
    setMessages(prev => [...prev, newUserMessage]);
    
    setIsLoading(true);
    
    try {
      const agentResponse = await callDigitalOceanAgent(userMessage);
      const assistantMessage: Message = { role: 'assistant', content: agentResponse };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = { 
        role: 'assistant', 
        content: 'Lo siento, ocurrió un error al procesar tu mensaje. Por favor, intenta de nuevo.' 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Botón flotante */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-full shadow-2xl hover:shadow-purple-500/50 hover:scale-110 transition-all duration-300 group"
          aria-label="Abrir chat de IA"
        >
          <MessageCircle className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
        </button>
      )}

      {/* Ventana de chat */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <MessageCircle className="w-6 h-6" />
                <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Asistente Electoral IA</h3>
                <p className="text-xs text-purple-100">Análisis político Colombia 2026</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-2 rounded-lg transition-colors"
              aria-label="Cerrar chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-none'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Analizando...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Pregunta sobre las elecciones..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-3 rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
                aria-label="Enviar mensaje"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Powered by Digital Ocean AI Agent
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatBubble;
