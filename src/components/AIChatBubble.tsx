import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Loader2, Sparkles, Mail } from 'lucide-react';
import { useOpenAIChat } from '../hooks/useOpenAIChat';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { parseCandidatesData } from '../utils/csvParser';
import { supabase } from '../lib/supabase';
import { CandidateCard } from './chat/CandidateCard';
import { CandidateComparison } from './chat/CandidateComparison';
import { ElectoralStats } from './chat/ElectoralStats';
import { ElectoralInsight } from './chat/ElectoralInsight';

// Generar contexto del sistema con datos actualizados del CSV
const generateSystemContext = () => {
  const candidates = parseCandidatesData();
  const top10 = candidates
    .sort((a, b) => b.intencionVoto - a.intencionVoto)
    .slice(0, 10);

  const contextLines = [
    'Eres un asistente político experto en análisis electoral de Colombia para las elecciones presidenciales 2026.',
    '',
    '**DATOS ELECTORALES ACTUALES (TOP 10 CANDIDATOS):**',
    '',
  ];

  top10.forEach((candidate, index) => {
    contextLines.push(
      `${index + 1}. **${candidate.nombre}** - ${candidate.intencionVoto}% intención de voto, ${candidate.tendenciaPolitica}, ${candidate.favorabilidad}% favorabilidad, ${candidate.partido}`
    );
  });

  contextLines.push(
    '',
    '**INSTRUCCIONES PRINCIPALES:**',
    '- Responde SOLO en español de forma clara, profesional y contextualizada',
    '- Usa formato Markdown para estructurar tus respuestas',
    '- Los datos pueden cambiar hasta las elecciones',
    '',
    '**REGLAS CRÍTICAS PARA HERRAMIENTAS VISUALES:**',
    '',
    '**RESPONDE CON TEXTO NATURAL (sin herramientas) cuando:**',
    '- El usuario hace preguntas de SEGUIMIENTO sobre un candidato ya mencionado (ej: "cuándo nació", "háblame más", "qué más sabes")',
    '- Preguntas puntuales de datos específicos (fechas, números, hechos)',
    '- Conversaciones generales sobre política colombiana',
    '- Ya mostraste la tarjeta de ese candidato antes en la conversación',
    '- El usuario NO pide explícitamente VER o MOSTRAR algo visual',
    '',
    '**USA herramientas visuales SOLO cuando:**',
    '- El usuario pide EXPLÍCITAMENTE "muéstrame" o "quiero ver" la tarjeta de un candidato por PRIMERA VEZ',
    '- El usuario pide COMPARAR candidatos específicamente',
    '- El usuario pide ver un RANKING o TOP',
    '',
    '**IMPORTANTE:** Si el usuario pregunta algo sobre un candidato del que YA mostraste tarjeta, responde con texto natural. No vuelvas a invocar la tarjeta.',
  );

  return contextLines.join('\n');
};

const AIChatBubble: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [emailError, setEmailError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const systemContext = generateSystemContext();

  // Verificar si hay email guardado en localStorage (usar la misma clave que SubscriptionModal)
  useEffect(() => {
    const savedEmail = localStorage.getItem('electoral_ai_email');
    const isSubscribed = localStorage.getItem('electoral_ai_subscribed');
    if (savedEmail && isSubscribed === 'true') {
      setUserEmail(savedEmail);
      setEmailSubmitted(true);
    }
  }, []);

  // Usar el hook personalizado para streaming de OpenAI
  const supabaseFunctionsUrl = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL || import.meta.env.VITE_SUPABASE_URL?.replace('.supabase.co', '.supabase.co/functions/v1');
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useOpenAIChat({
    api: `${supabaseFunctionsUrl}/chat-ai`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: {
      systemContext,
    },
    initialMessages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: '¡Hola! 👋 Soy tu **Asistente Electoral IA** especializado en las elecciones presidenciales de Colombia 2026.\n\n**Puedo ayudarte con:**\n\n• 📊 Análisis de intención de voto y favorabilidad\n• 🔍 Información detallada de candidatos\n• 📈 Comparaciones entre candidatos\n• 🎯 Tendencias políticas y proyecciones\n• 📉 Estadísticas electorales actualizadas\n\n**¿Qué te gustaría saber?**',
      },
    ],
    onError: (error) => {
      console.error('Error en chat:', error);
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Validar email
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Manejar envío de email
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userEmail || !userEmail.trim()) {
      setEmailError('Por favor ingresa tu correo electrónico');
      return;
    }

    if (!validateEmail(userEmail)) {
      setEmailError('Por favor ingresa un correo electrónico válido');
      return;
    }

    try {
      // Verificar si el email ya existe en Supabase
      const { data: existingSubscription, error: selectError } = await supabase
        .from('subscriptions')
        .select('email')
        .eq('email', userEmail)
        .maybeSingle();

      if (!existingSubscription) {
        // Crear nueva suscripción en Supabase
        const { error: insertError } = await supabase
          .from('subscriptions')
          .insert([{ email: userEmail, active: true }]);

        if (insertError) {
          console.error('Error al guardar en Supabase:', insertError);
          setEmailError('Hubo un error al procesar tu email. Inténtalo de nuevo.');
          return;
        }
      }

      // Guardar email en localStorage (usar la misma clave que SubscriptionModal)
      localStorage.setItem('electoral_ai_email', userEmail);
      localStorage.setItem('electoral_ai_subscribed', 'true');
      setEmailSubmitted(true);
      setEmailError('');
    } catch (error) {
      console.error('Error al procesar email:', error);
      setEmailError('Hubo un error al procesar tu email. Inténtalo de nuevo.');
    }
  };

  // Renderizar componentes de UI generativa basados en tool calls
  const renderToolCall = (toolCall: any) => {
    if (!toolCall || !toolCall.toolName) return null;
    
    const allCandidates = parseCandidatesData();

    try {
      switch (toolCall.toolName) {
        case 'showCandidateCard': {
          const { candidateName } = toolCall.args || {};
          if (!candidateName) return null;
          
          const candidate = allCandidates.find(c =>
            c.nombre.toLowerCase().includes(candidateName.toLowerCase())
          );
          return candidate ? <CandidateCard candidate={candidate} /> : null;
        }

        case 'compareCandidates': {
          const { candidateNames, title } = toolCall.args || {};
          if (!candidateNames || !Array.isArray(candidateNames)) return null;
          
          const candidates = candidateNames
            .map((name: string) => allCandidates.find(c => c.nombre.toLowerCase().includes(name.toLowerCase())))
            .filter(Boolean)
            .map((c: any) => ({
              nombre: c.nombre,
              intencionVoto: c.intencionVoto,
              favorabilidad: c.favorabilidad,
              tendenciaPolitica: c.tendenciaPolitica,
              partido: c.partido,
            }));
          return candidates.length > 0 ? <CandidateComparison candidates={candidates} title={title} /> : null;
        }

        case 'showTopCandidates': {
          const { count, filterBy = 'intencionVoto' } = toolCall.args || {};
          const candidates = allCandidates
            .sort((a, b) => {
              if (filterBy === 'favorabilidad') {
                return b.favorabilidad - a.favorabilidad;
              }
              return b.intencionVoto - a.intencionVoto;
            })
            .slice(0, count || 5)
            .map(c => ({
              nombre: c.nombre,
              intencionVoto: c.intencionVoto,
              favorabilidad: c.favorabilidad,
              tendenciaPolitica: c.tendenciaPolitica,
              partido: c.partido,
            }));
          const title = filterBy === 'favorabilidad'
            ? `Top ${count || 5} Candidatos por Favorabilidad`
            : `Top ${count || 5} Candidatos por Intención de Voto`;
          return <CandidateComparison candidates={candidates} title={title} />;
        }

        case 'showElectoralStats': {
          const { title, stats, description } = toolCall.args || {};
          if (!title || !stats) return null;
          return <ElectoralStats title={title} stats={stats} description={description} />;
        }

        case 'showInsight': {
          const { type, title, message, details } = toolCall.args || {};
          if (!type || !title || !message) return null;
          return <ElectoralInsight type={type} title={title} message={message} details={details} />;
        }

        case 'showCandidatesByTendency': {
          const { tendency, limit } = toolCall.args || {};
          if (!tendency) return null;
          
          const candidates = allCandidates
            .filter(c => c.tendenciaPolitica.toLowerCase() === tendency.toLowerCase())
            .sort((a, b) => b.intencionVoto - a.intencionVoto)
            .slice(0, limit || 5)
            .map(c => ({
              nombre: c.nombre,
              intencionVoto: c.intencionVoto,
              favorabilidad: c.favorabilidad,
              tendenciaPolitica: c.tendenciaPolitica,
              partido: c.partido,
            }));
          return candidates.length > 0 ? <CandidateComparison candidates={candidates} title={`Candidatos de ${tendency}`} /> : null;
        }

        default:
          return null;
      }
    } catch (error) {
      console.error('Error renderizando tool call:', error);
      return null;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
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
            : 'bg-gradient-to-r from-teal-600 to-teal-600 hover:from-teal-700 hover:to-teal-700'
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
        <div className="fixed bottom-24 right-4 z-50 w-[90vw] max-w-[420px] h-[70vh] max-h-[580px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-600 to-teal-600 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Asistente Electoral IA</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario de email si no está enviado */}
          {!emailSubmitted ? (
            <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
              <div className="w-full max-w-sm">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-teal-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Bienvenido al Chat Electoral</h3>
                  <p className="text-sm text-gray-600">
                    Para comenzar a usar el asistente de IA, por favor ingresa tu correo electrónico
                  </p>
                </div>

                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div>
                    <input
                      type="email"
                      value={userEmail}
                      onChange={(e) => {
                        setUserEmail(e.target.value);
                        setEmailError('');
                      }}
                      placeholder="tu@email.com"
                      className={`w-full px-4 py-3 rounded-xl border ${
                        emailError ? 'border-red-500' : 'border-gray-300'
                      } focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all`}
                      required
                    />
                    {emailError && (
                      <p className="text-red-500 text-xs mt-1">{emailError}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-teal-600 to-teal-600 hover:from-teal-700 hover:to-teal-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    Comenzar Chat
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    Tu email solo se usa para personalizar la experiencia
                  </p>
                </form>
              </div>
            </div>
          ) : (
            <>
              {/* Mensajes */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-teal-600 to-teal-600 text-white rounded-br-sm'
                          : 'bg-white text-gray-800 shadow-md rounded-bl-sm border border-gray-100'
                      }`}
                    >
                      {message.role === 'assistant' ? (
                        <div className="prose prose-sm max-w-none">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              h1: ({ children }) => <h1 className="text-lg font-bold mb-2 text-gray-900">{children}</h1>,
                              h2: ({ children }) => <h2 className="text-base font-bold mb-2 text-gray-800">{children}</h2>,
                              h3: ({ children }) => <h3 className="text-sm font-bold mb-1 text-gray-800">{children}</h3>,
                              p: ({ children }) => <p className="text-sm mb-2 text-gray-700 leading-relaxed">{children}</p>,
                              ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1 text-sm text-gray-700">{children}</ul>,
                              ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1 text-sm text-gray-700">{children}</ol>,
                              li: ({ children }) => <li className="text-sm text-gray-700">{children}</li>,
                              strong: ({ children }) => <strong className="font-bold text-gray-900">{children}</strong>,
                              em: ({ children }) => <em className="italic text-gray-600">{children}</em>,
                              code: ({ children }) => <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono text-teal-700">{children}</code>,
                            }}
                          >
                            {message.content || ''}
                          </ReactMarkdown>

                          {/* Renderizar tool calls si existen */}
                          {message.toolCalls?.map((toolCall: any, index: number) => (
                            <div key={index} className="mt-3">
                              {renderToolCall(toolCall)}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm whitespace-pre-wrap break-words">{message.content || ''}</p>
                      )}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white text-gray-800 shadow-md rounded-2xl rounded-bl-sm px-4 py-3 border border-gray-100">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
                        <span className="text-sm text-gray-500">Generando respuesta...</span>
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="flex justify-start">
                    <div className="bg-red-50 text-red-800 shadow-md rounded-2xl rounded-bl-sm px-4 py-3 border border-red-200">
                      <p className="text-sm">
                        <strong>Error:</strong> {error.message || 'Hubo un problema al conectar con el servidor. Por favor intenta de nuevo.'}
                      </p>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 bg-white border-t border-gray-200">
                <form onSubmit={handleSubmit} className="flex items-end space-x-2">
                  <div className="flex-1 relative">
                    <textarea
                      value={input || ''}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      placeholder="Escribe tu pregunta..."
                      className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none resize-none transition-all"
                      rows={1}
                      style={{
                        minHeight: '48px',
                        maxHeight: '120px',
                      }}
                      disabled={isLoading}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!input || !input.trim() || isLoading}
                    className={`p-3 rounded-xl transition-all duration-200 ${
                      input && input.trim() && !isLoading
                        ? 'bg-gradient-to-r from-teal-600 to-teal-600 hover:from-teal-700 hover:to-teal-700 text-white shadow-md hover:shadow-lg transform hover:scale-105'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </form>
                <p className="text-xs text-gray-400 mt-2 text-center">
                  Presiona Enter para enviar • Shift + Enter para nueva línea
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default AIChatBubble;
