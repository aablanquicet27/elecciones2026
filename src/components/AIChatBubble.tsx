import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Loader2, Sparkles } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SYSTEM_CONTEXT = `Eres un asistente político experto en análisis electoral de Colombia para las elecciones presidenciales 2026.

DATOS ELECTORALES ACTUALES (TOP 10 CANDIDATOS):

1. **Vicky Dávila** - 11.5% intención de voto, Derecha, 38% favorabilidad, Candidata por firmas
2. **Gustavo Bolívar** - 10.5%, Izquierda, 34% favorabilidad, Pacto Histórico
3. **Sergio Fajardo** - 8.7%, Centro, 42% favorabilidad, Centro Esperanza
4. **Daniel Quintero** - 8.1%, Izquierda, 23% favorabilidad, Candidato por firmas
5. **Claudia López** - 5.3%, Centro, 31% favorabilidad, Candidata por firmas
6. **María José Pizarro** - 3.2%, Izquierda, 29% favorabilidad, Pacto Histórico
7. **Juan Manuel Galán** - 3.0%, Centro, 40% favorabilidad, Nuevo Liberalismo
8. **Germán Vargas Lleras** - 2.9%, Derecha, 29% favorabilidad, Cambio Radical
9. **Jota Pe Hernández** - 2.5%, Derecha, 35% favorabilidad, Candidato por firmas
10. **Carolina Corcho** - 2.4%, Izquierda, 25% favorabilidad, Pacto Histórico

INSTRUCCIONES:
- Responde SOLO en español de forma clara, concisa y estructurada
- Usa markdown para mejor legibilidad: **negritas** para puntos importantes, listas con bullets
- Usa estos datos para análisis y predicciones
- NO muestres tu pensamiento interno (thinking)
- Sé directo y profesional
- Si preguntan por candidatos específicos, usa los datos de arriba
- Menciona que los datos pueden cambiar hasta las elecciones`;

const AIChatBubble: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '¡Hola! 👋 Soy tu asistente de análisis electoral. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Función para limpiar el contenido del agente
  const cleanAgentResponse = (content: string): string => {
    // Remover tags <think>...</think> y su contenido
    let cleaned = content.replace(/<think>[\s\S]*?<\/think>/gi, '');
    
    // Remover tags <think> sin cerrar (por si acaso)
    cleaned = cleaned.replace(/<\/?think>/gi, '');
    
    // Limpiar espacios en blanco extra
    cleaned = cleaned.trim();
    
    return cleaned;
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Preparar el historial de mensajes para el agente
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Agregar el nuevo mensaje del usuario
      conversationHistory.push({
        role: 'user',
        content: inputMessage
      });

      // Obtener las variables de entorno correctamente en Vite
      const endpoint = import.meta.env.VITE_DO_AGENT_ENDPOINT;
      const accessKey = import.meta.env.VITE_DO_AGENT_ACCESS_KEY;

      if (!endpoint || !accessKey) {
        throw new Error('Las variables de entorno del agente de IA no están configuradas');
      }

      // Llamar al agente de DigitalOcean usando fetch
      const response = await fetch(`${endpoint}/api/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessKey}`,
          'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify({
          messages: conversationHistory,
          instruction_override: SYSTEM_CONTEXT
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Error del servidor: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      
      // Limpiar el contenido de la respuesta
      const rawContent = data.choices[0].message.content;
      const cleanedContent = cleanAgentResponse(rawContent);

      const assistantMessage: Message = {
        role: 'assistant',
        content: cleanedContent,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error al comunicarse con el agente de DigitalOcean:', error);
      
      let errorMessage = 'Lo siento, hubo un error al procesar tu mensaje. Por favor intenta de nuevo.';
      
      if (error instanceof Error) {
        if (error.message.includes('Error del servidor')) {
          errorMessage = error.message;
        } else if (error.message.includes('fetch') || error.message.includes('Network')) {
          errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
        } else if (error.message.includes('variables de entorno')) {
          errorMessage = 'Error de configuración: ' + error.message;
        }
      }

      const errorMessageObj: Message = {
        role: 'assistant',
        content: errorMessage,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessageObj]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 ${
          isOpen
            ? 'bg-red-500 hover:bg-red-600'
            : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
        }`}
        aria-label={isOpen ? 'Cerrar chat' : 'Abrir chat de IA'}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <div className="relative">
            <MessageCircle className="w-6 h-6 text-white" />
            <Sparkles className="w-3 h-3 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
          </div>
        )}
      </button>

      {/* Ventana de chat */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Asistente Electoral IA</h3>
                  <p className="text-xs text-purple-100">Análisis electoral inteligente</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-sm'
                      : 'bg-white text-gray-800 shadow-md rounded-bl-sm border border-gray-100'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.role === 'user' ? 'text-purple-100' : 'text-gray-400'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString('es-CO', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 shadow-md rounded-2xl rounded-bl-sm px-4 py-3 border border-gray-100">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                    <span className="text-sm text-gray-500">Escribiendo...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex items-end space-x-2">
              <div className="flex-1 relative">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe tu pregunta..."
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none resize-none transition-all"
                  rows={1}
                  style={{
                    minHeight: '48px',
                    maxHeight: '120px'
                  }}
                  disabled={isLoading}
                />
              </div>
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className={`p-3 rounded-xl transition-all duration-200 ${
                  inputMessage.trim() && !isLoading
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transform hover:scale-105'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Presiona Enter para enviar • Shift + Enter para nueva línea
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatBubble;
