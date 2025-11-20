import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Loader2, Sparkles } from 'lucide-react';
import { useChat } from '@ai-sdk/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { parseCandidatesData } from '../lib/ai-tools';
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
    '**INSTRUCCIONES:**',
    '- Responde SOLO en español de forma clara, profesional y contextualizada',
    '- Usa formato Markdown para estructurar tus respuestas con encabezados, negritas, listas, etc.',
    '- Cuando sea relevante, utiliza las herramientas disponibles para mostrar tarjetas de candidatos, comparaciones y estadísticas visuales',
    '- Si el usuario pregunta por candidatos específicos, usa `showCandidateCard` para mostrar sus datos',
    '- Para comparaciones entre candidatos, usa `compareCandidates`',
    '- Para mostrar rankings, usa `showTopCandidates`',
    '- Para insights importantes, usa `showInsight`',
    '- Sé proactivo en ofrecer visualizaciones cuando sea apropiado',
    '- Los datos pueden cambiar hasta las elecciones, siempre menciona que son proyecciones actuales',
    '- Usa enumeraciones, viñetas y formato rico para hacer las respuestas más legibles',
  );

  return contextLines.join('\n');
};

const AIChatBubbleNew: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const systemContext = generateSystemContext();

  // Usar el hook de AI SDK con streaming
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: import.meta.env.VITE_SUPABASE_FUNCTIONS_URL + '/chat-ai',
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
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Renderizar componentes de UI generativa basados en tool calls
  const renderToolCall = (toolCall: any) => {
    const allCandidates = parseCandidatesData();

    switch (toolCall.toolName) {
      case 'showCandidateCard': {
        const { candidateName } = toolCall.args;
        const candidate = allCandidates.find(c =>
          c.nombre.toLowerCase().includes(candidateName.toLowerCase())
        );
        return candidate ? <CandidateCard candidate={candidate} /> : null;
      }

      case 'compareCandidates': {
        const { candidateNames, title } = toolCall.args;
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
        const { count, filterBy = 'intencionVoto' } = toolCall.args;
        const candidates = allCandidates
          .sort((a, b) => {
            if (filterBy === 'favorabilidad') {
              return b.favorabilidad - a.favorabilidad;
            }
            return b.intencionVoto - a.intencionVoto;
          })
          .slice(0, count)
          .map(c => ({
            nombre: c.nombre,
            intencionVoto: c.intencionVoto,
            favorabilidad: c.favorabilidad,
            tendenciaPolitica: c.tendenciaPolitica,
            partido: c.partido,
          }));
        const title = filterBy === 'favorabilidad'
          ? `Top ${count} Candidatos por Favorabilidad`
          : `Top ${count} Candidatos por Intención de Voto`;
        return <CandidateComparison candidates={candidates} title={title} />;
      }

      case 'showElectoralStats': {
        const { title, stats, description } = toolCall.args;
        return <ElectoralStats title={title} stats={stats} description={description} />;
      }

      case 'showInsight': {
        const { type, title, message, details } = toolCall.args;
        return <ElectoralInsight type={type} title={title} message={message} details={details} />;
      }

      case 'showCandidatesByTendency': {
        const { tendency, limit } = toolCall.args;
        const candidates = allCandidates
          .filter(c => c.tendenciaPolitica.toLowerCase() === tendency.toLowerCase())
          .sort((a, b) => b.intencionVoto - a.intencionVoto)
          .slice(0, limit)
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
        <div className="fixed bottom-24 right-6 z-50 w-[450px] h-[650px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Asistente Electoral IA</h3>
                  <p className="text-xs text-purple-100">Powered by GPT-5.1</p>
                </div>
              </div>
            </div>
          </div>

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
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-sm'
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
                          code: ({ children }) => <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono text-purple-700">{children}</code>,
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>

                      {/* Renderizar tool calls si existen */}
                      {message.toolInvocations?.map((toolCall: any, index: number) => (
                        <div key={index} className="mt-3">
                          {renderToolCall(toolCall)}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 shadow-md rounded-2xl rounded-bl-sm px-4 py-3 border border-gray-100">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                    <span className="text-sm text-gray-500">Generando respuesta...</span>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="flex justify-start">
                <div className="bg-red-50 text-red-800 shadow-md rounded-2xl rounded-bl-sm px-4 py-3 border border-red-200">
                  <p className="text-sm">Error: {error.message}</p>
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
                  value={input}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe tu pregunta..."
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none resize-none transition-all"
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
                disabled={!input.trim() || isLoading}
                className={`p-3 rounded-xl transition-all duration-200 ${
                  input.trim() && !isLoading
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
            </form>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Presiona Enter para enviar • Shift + Enter para nueva línea
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatBubbleNew;
