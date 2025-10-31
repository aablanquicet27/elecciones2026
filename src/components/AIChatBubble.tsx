import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const SYSTEM_CONTEXT = `Eres un asistente pol?tico experto en an?lisis electoral de Colombia para las elecciones presidenciales 2026.

DATOS ELECTORALES ACTUALES (TOP 10 CANDIDATOS):

1. **Vicky D?vila** - 11.5% intenci?n de voto, Derecha, 38% favorabilidad, Candidata por firmas
2. **Gustavo Bol?var** - 10.5%, Izquierda, 34% favorabilidad, Pacto Hist?rico
3. **Sergio Fajardo** - 8.7%, Centro, 42% favorabilidad, Centro Esperanza
4. **Daniel Quintero** - 8.1%, Izquierda, 23% favorabilidad, Candidato por firmas
5. **Claudia L?pez** - 5.3%, Centro, 31% favorabilidad, Candidata por firmas
6. **Mar?a Jos? Pizarro** - 3.2%, Izquierda, 29% favorabilidad, Pacto Hist?rico
7. **Juan Manuel Gal?n** - 3.0%, Centro, 40% favorabilidad, Nuevo Liberalismo
8. **Germ?n Vargas Lleras** - 2.9%, Derecha, 29% favorabilidad, Cambio Radical
9. **Jota Pe Hern?ndez** - 2.5%, Derecha, 35% favorabilidad, Candidato por firmas
10. **Carolina Corcho** - 2.4%, Izquierda, 25% favorabilidad, Pacto Hist?rico

INSTRUCCIONES:
- Responde SOLO en espa?ol de forma clara, concisa y estructurada
- Usa markdown para mejor legibilidad: **negritas** para puntos importantes, listas con bullets
- Usa estos datos para an?lisis y predicciones
- NO muestres tu pensamiento interno (thinking)
- S? directo y profesional
- Si preguntan por candidatos espec?ficos, usa los datos de arriba
- Menciona que los datos pueden cambiar hasta las elecciones`;

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Componente minimalista para renderizar Markdown
const MarkdownText: React.FC<{ content: string }> = ({ content }) => {
  const renderContent = () => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let currentList: string[] = [];
    
    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="space-y-1.5 my-2 ml-1">
            {currentList.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-purple-500 mt-0.5 font-bold">?</span>
                <span dangerouslySetInnerHTML={{ __html: parseInline(item) }} />
              </li>
            ))}
          </ul>
        );
        currentList = [];
      }
    };

    const parseInline = (text: string): string => {
      return text
        .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
        .replace(/\*(.+?)\*/g, '<em class="italic text-gray-700">$1</em>')
        .replace(/`(.+?)`/g, '<code class="bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>');
    };

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      // Lista con bullets o guiones
      if (trimmedLine.match(/^[?\-\*]\s+/)) {
        currentList.push(trimmedLine.replace(/^[?\-\*]\s+/, ''));
      }
      // Lista numerada
      else if (trimmedLine.match(/^\d+\.\s+/)) {
        currentList.push(trimmedLine.replace(/^\d+\.\s+/, ''));
      }
      // L?nea vac?a
      else if (trimmedLine === '') {
        flushList();
        if (elements.length > 0 && index < lines.length - 1) {
          elements.push(<div key={`space-${index}`} className="h-2" />);
        }
      }
      // Texto normal
      else {
        flushList();
        elements.push(
          <p 
            key={`p-${index}`} 
            className="leading-relaxed text-sm" 
            dangerouslySetInnerHTML={{ __html: parseInline(line) }} 
          />
        );
      }
    });

    flushList();
    return elements;
  };

  return <div className="space-y-1">{renderContent()}</div>;
};

const AIChatBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Funci?n para limpiar el contenido del agente
  const cleanAgentResponse = (content: string): string => {
    // Remover tags <think>...</think> y su contenido
    let cleaned = content.replace(/<think>[\s\S]*?<\/think>/gi, '');
    
    // Remover tags <think> sin cerrar (por si acaso)
    cleaned = cleaned.replace(/<\/?think>/gi, '');
    
    // Limpiar espacios en blanco extra
    cleaned = cleaned.trim();
    
    return cleaned;
  };

  const callDigitalOceanAgent = async (userMessage: string) => {
    try {
      setIsLoading(true);
      
      // Agregar mensaje del usuario
      const newUserMessage: Message = { role: 'user', content: userMessage, timestamp: new Date() };
      setMessages(prevMessages => [...prevMessages, newUserMessage]);
      
      // Preparar el historial de mensajes
      const conversationHistory = [...messages, newUserMessage].map(m => ({ 
        role: m.role, 
        content: m.content 
      }));

      // Obtener las variables de entorno
      const endpoint = import.meta.env.VITE_DO_AGENT_ENDPOINT;
      const accessKey = import.meta.env.VITE_DO_AGENT_ACCESS_KEY;

      if (!endpoint || !accessKey) {
        throw new Error('Las variables de entorno del agente de IA no est?n configuradas');
      }

      const response = await axios.post(`${endpoint}/api/v1/chat/completions`, {
        messages: conversationHistory,
        instruction_override: SYSTEM_CONTEXT
      }, {
        headers: {
          'Authorization': `Bearer ${accessKey}`,
          'Content-Type': 'application/json'
        }
      });

      // Limpiar el contenido de la respuesta
      const rawContent = response.data.choices[0].message.content;
      const cleanedContent = cleanAgentResponse(rawContent);

      setMessages(prevMessages => [...prevMessages, { 
        role: 'assistant', 
        content: cleanedContent,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Error communicating with DigitalOcean Agent:', error);
      
      let errorMessage = 'Lo siento, hubo un error al comunicarme con el asistente. Por favor intenta de nuevo.';
      
      if (error instanceof Error) {
        if (error.message.includes('variables de entorno')) {
          errorMessage = 'Error de configuraci?n: ' + error.message;
        }
      }

      setMessages(prevMessages => [...prevMessages, { 
        role: 'assistant', 
        content: errorMessage,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      callDigitalOceanAgent(inputValue);
      setInputValue('');
    }
  };

  return (
    <>
      {/* Bot?n flotante de la burbuja */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group hover:scale-110"
        aria-label="Abrir chat con IA"
      >
        {isOpen ? (
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
        {messages.length > 0 && !isOpen && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {messages.filter(m => m.role === 'assistant').length}
          </span>
        )}
      </button>

      {/* Panel de chat */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[500px] bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <h3 className="font-semibold">Asistente Electoral IA</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 rounded p-1 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.length === 0 ? (
              <div className="text-center text-gray-600 mt-8 px-4">
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-100">
                  <svg className="w-12 h-12 mx-auto mb-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <h4 className="font-semibold text-gray-800 mb-2">Asistente Electoral IA</h4>
                  <p className="text-sm text-gray-600 mb-3">Preg?ntame sobre:</p>
                  <div className="text-xs text-left space-y-1.5 text-gray-600">
                    <div className="flex items-center gap-2">
                      <span className="text-purple-500">?</span>
                      <span>Candidatos y sus propuestas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-purple-500">?</span>
                      <span>An?lisis de encuestas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-purple-500">?</span>
                      <span>Tendencias pol?ticas</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-3.5 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-md'
                        : 'bg-white text-gray-700 border border-gray-100 shadow-sm'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <>
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                        <p className="text-xs mt-1 text-purple-100">
                          {message.timestamp.toLocaleTimeString('es-CO', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="text-sm">
                          <MarkdownText content={message.content} />
                        </div>
                        <p className="text-xs mt-1 text-gray-400">
                          {message.timestamp.toLocaleTimeString('es-CO', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 rounded-2xl p-3 shadow-sm">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Escribe tu pregunta..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default AIChatBubble;
