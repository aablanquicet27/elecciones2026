import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
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

// Contexto del sistema con datos actualizados del CSV
const generateSystemContext = () => {
  const candidates = parseCandidatesData();
  const top10 = candidates.sort((a, b) => b.intencionVoto - a.intencionVoto).slice(0, 10);
  const lines = [
    'Eres un asistente político experto en análisis electoral de Colombia para las elecciones presidenciales 2026.',
    '',
    '**DATOS ELECTORALES ACTUALES (TOP 10 CANDIDATOS):**',
    '',
  ];
  top10.forEach((c, i) => {
    lines.push(`${i + 1}. **${c.nombre}** - ${c.intencionVoto}% intención de voto, ${c.tendenciaPolitica}, ${c.favorabilidad}% favorabilidad, ${c.partido}`);
  });
  lines.push(
    '',
    '**INSTRUCCIONES:**',
    '- Responde SOLO en español, claro y contextualizado. Habla únicamente de las elecciones de Colombia 2026.',
    '- Usa Markdown para estructurar. Sé concreto: nombres, cifras, fechas.',
    '- Los datos pueden cambiar hasta las elecciones.',
  );
  return lines.join('\n');
};

const AIChatBubble: React.FC = () => {
  const dark = useLocation().pathname === '/ia';
  const [isOpen, setIsOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [emailError, setEmailError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionIdRef = useRef<string>(crypto.randomUUID());
  const systemContext = generateSystemContext();

  useEffect(() => {
    const savedEmail = localStorage.getItem('electoral_ai_email');
    const isSubscribed = localStorage.getItem('electoral_ai_subscribed');
    if (savedEmail && isSubscribed === 'true') { setUserEmail(savedEmail); setEmailSubmitted(true); }
  }, []);

  const supabaseFunctionsUrl = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL || import.meta.env.VITE_SUPABASE_URL?.replace('.supabase.co', '.supabase.co/functions/v1');
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useOpenAIChat({
    api: `${supabaseFunctionsUrl}/chat-ai`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: { systemContext },
    initialMessages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: dark
          ? '**Pulso Electoral IA** · pregúntame lo que quieras de la segunda vuelta (Cepeda vs De la Espriella): probabilidades, encuestas, fortalezas y riesgos, qué está pasando ahora. Respondo en vivo.'
          : '¡Hola! 👋 Soy tu **Asistente Electoral IA** especializado en las elecciones presidenciales de Colombia 2026.\n\n**Puedo ayudarte con:**\n\n• 📊 Análisis de intención de voto y favorabilidad\n• 🔍 Información de candidatos\n• 📈 Comparaciones\n• 🎯 Tendencias y proyecciones\n\n**¿Qué te gustaría saber?**',
      },
    ],
    onError: (e) => console.error('Error en chat:', e),
  });

  useEffect(() => {
    const save = async () => {
      if (messages.length <= 1) return;
      try {
        await supabase.from('chat_conversations').upsert({
          session_id: sessionIdRef.current, messages, user_email: userEmail || null, updated_at: new Date().toISOString(),
        }, { onConflict: 'session_id' });
      } catch (err) { console.error('Error guardando conversación:', err); }
    };
    save();
  }, [messages, userEmail]);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => { scrollToBottom(); }, [messages]);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userEmail || !userEmail.trim()) { setEmailError('Por favor ingresa tu correo electrónico'); return; }
    if (!validateEmail(userEmail)) { setEmailError('Por favor ingresa un correo electrónico válido'); return; }
    try {
      const { data: existing } = await supabase.from('subscriptions').select('email').eq('email', userEmail).maybeSingle();
      if (!existing) {
        const { error: insertError } = await supabase.from('subscriptions').insert([{ email: userEmail, active: true }]);
        if (insertError) { setEmailError('Hubo un error al procesar tu email. Inténtalo de nuevo.'); return; }
      }
      localStorage.setItem('electoral_ai_email', userEmail);
      localStorage.setItem('electoral_ai_subscribed', 'true');
      setEmailSubmitted(true); setEmailError('');
    } catch { setEmailError('Hubo un error al procesar tu email. Inténtalo de nuevo.'); }
  };

  const renderToolCall = (toolCall: any) => {
    if (!toolCall || !toolCall.toolName) return null;
    const allCandidates = parseCandidatesData();
    try {
      switch (toolCall.toolName) {
        case 'showCandidateCard': {
          const { candidateName } = toolCall.args || {};
          if (!candidateName) return null;
          const candidate = allCandidates.find(c => c.nombre.toLowerCase().includes(candidateName.toLowerCase()));
          return candidate ? <CandidateCard candidate={candidate} /> : null;
        }
        case 'compareCandidates': {
          const { candidateNames, title } = toolCall.args || {};
          if (!candidateNames || !Array.isArray(candidateNames)) return null;
          const candidates = candidateNames
            .map((name: string) => allCandidates.find(c => c.nombre.toLowerCase().includes(name.toLowerCase())))
            .filter(Boolean)
            .map((c: any) => ({ nombre: c.nombre, intencionVoto: c.intencionVoto, favorabilidad: c.favorabilidad, tendenciaPolitica: c.tendenciaPolitica, partido: c.partido }));
          return candidates.length > 0 ? <CandidateComparison candidates={candidates} title={title} /> : null;
        }
        case 'showTopCandidates': {
          const { count, filterBy = 'intencionVoto' } = toolCall.args || {};
          const candidates = allCandidates
            .sort((a, b) => (filterBy === 'favorabilidad' ? b.favorabilidad - a.favorabilidad : b.intencionVoto - a.intencionVoto))
            .slice(0, count || 5)
            .map(c => ({ nombre: c.nombre, intencionVoto: c.intencionVoto, favorabilidad: c.favorabilidad, tendenciaPolitica: c.tendenciaPolitica, partido: c.partido }));
          const title = filterBy === 'favorabilidad' ? `Top ${count || 5} por Favorabilidad` : `Top ${count || 5} por Intención de Voto`;
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
            .map(c => ({ nombre: c.nombre, intencionVoto: c.intencionVoto, favorabilidad: c.favorabilidad, tendenciaPolitica: c.tendenciaPolitica, partido: c.partido }));
          return candidates.length > 0 ? <CandidateComparison candidates={candidates} title={`Candidatos de ${tendency}`} /> : null;
        }
        default: return null;
      }
    } catch (e) { console.error('Error renderizando tool call:', e); return null; }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e as any); }
  };

  // ---- Tema ----
  const grad = dark ? 'bg-gradient-to-r from-[#4C8DFF] to-[#FF4D6D]' : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700';
  const md = dark
    ? {
        h1: ({ children }: any) => <h1 className="text-lg font-bold mb-2 text-white">{children}</h1>,
        h2: ({ children }: any) => <h2 className="text-base font-bold mb-2 text-slate-100">{children}</h2>,
        h3: ({ children }: any) => <h3 className="text-sm font-bold mb-1 text-slate-100">{children}</h3>,
        p: ({ children }: any) => <p className="text-sm mb-2 text-slate-300 leading-relaxed">{children}</p>,
        ul: ({ children }: any) => <ul className="list-disc list-inside mb-2 space-y-1 text-sm text-slate-300">{children}</ul>,
        ol: ({ children }: any) => <ol className="list-decimal list-inside mb-2 space-y-1 text-sm text-slate-300">{children}</ol>,
        li: ({ children }: any) => <li className="text-sm text-slate-300">{children}</li>,
        strong: ({ children }: any) => <strong className="font-bold text-white">{children}</strong>,
        em: ({ children }: any) => <em className="italic text-slate-400">{children}</em>,
        code: ({ children }: any) => <code className="bg-white/10 px-1 py-0.5 rounded text-xs font-mono text-[#7DD3FC]">{children}</code>,
      }
    : {
        h1: ({ children }: any) => <h1 className="text-lg font-bold mb-2 text-gray-900">{children}</h1>,
        h2: ({ children }: any) => <h2 className="text-base font-bold mb-2 text-gray-800">{children}</h2>,
        h3: ({ children }: any) => <h3 className="text-sm font-bold mb-1 text-gray-800">{children}</h3>,
        p: ({ children }: any) => <p className="text-sm mb-2 text-gray-700 leading-relaxed">{children}</p>,
        ul: ({ children }: any) => <ul className="list-disc list-inside mb-2 space-y-1 text-sm text-gray-700">{children}</ul>,
        ol: ({ children }: any) => <ol className="list-decimal list-inside mb-2 space-y-1 text-sm text-gray-700">{children}</ol>,
        li: ({ children }: any) => <li className="text-sm text-gray-700">{children}</li>,
        strong: ({ children }: any) => <strong className="font-bold text-gray-900">{children}</strong>,
        em: ({ children }: any) => <em className="italic text-gray-600">{children}</em>,
        code: ({ children }: any) => <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono text-purple-700">{children}</code>,
      };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 ${grad}`}
          aria-label="Abrir chat de IA"
        >
          <div className="relative">
            <MessageCircle className="w-6 h-6 text-white" />
            <Sparkles className="w-3 h-3 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
          </div>
        </button>
      )}

      {isOpen && (
        <div className={`fixed z-50 flex flex-col overflow-hidden shadow-2xl inset-0 w-full h-full rounded-none sm:inset-auto sm:bottom-24 sm:right-4 sm:w-[90vw] sm:max-w-[420px] sm:h-[70vh] sm:max-h-[580px] sm:rounded-2xl animate-in slide-in-from-bottom-5 duration-300 ${dark ? 'bg-[#0A0C12] sm:border border-white/10' : 'bg-white'}`}>
          {/* Header */}
          <div className={`p-4 text-white flex items-center justify-between ${dark ? 'bg-[#10131c] border-b border-white/10' : 'bg-gradient-to-r from-purple-600 to-indigo-600'}`}>
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${dark ? 'bg-white/10' : 'bg-white/20'}`}>
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg">{dark ? 'Pulso Electoral IA' : 'Asistente Electoral IA'}</h3>
                {dark && <p className="text-[11px] text-slate-400">En vivo · segunda vuelta 2026</p>}
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 -mr-1 rounded-full hover:bg-white/15 transition-colors" aria-label="Cerrar chat">
              <X className="w-5 h-5" />
            </button>
          </div>

          {!emailSubmitted ? (
            <div className={`flex-1 flex items-center justify-center p-6 ${dark ? 'bg-[#0A0C12]' : 'bg-gray-50'}`}>
              <div className="w-full max-w-sm">
                <div className="text-center mb-6">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${dark ? 'bg-[#4C8DFF]/15' : 'bg-purple-100'}`}>
                    <Mail className={`w-8 h-8 ${dark ? 'text-[#4C8DFF]' : 'text-purple-600'}`} />
                  </div>
                  <h3 className={`text-xl font-bold mb-2 ${dark ? 'text-slate-100' : 'text-gray-900'}`}>Bienvenido al Chat Electoral</h3>
                  <p className={`text-sm ${dark ? 'text-slate-400' : 'text-gray-600'}`}>Ingresa tu correo para comenzar a usar el asistente.</p>
                </div>
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <input
                    type="email" value={userEmail}
                    onChange={(e) => { setUserEmail(e.target.value); setEmailError(''); }}
                    placeholder="tu@email.com"
                    className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${
                      dark
                        ? `bg-[#10131c] text-slate-100 placeholder-slate-500 ${emailError ? 'border-red-500' : 'border-white/15'} focus:border-[#4C8DFF] focus:ring-2 focus:ring-[#4C8DFF]/30`
                        : `${emailError ? 'border-red-500' : 'border-gray-300'} focus:border-purple-500 focus:ring-2 focus:ring-purple-200`
                    }`}
                    required
                  />
                  {emailError && <p className="text-red-500 text-xs">{emailError}</p>}
                  <button type="submit" className={`w-full text-white font-semibold py-3 rounded-xl transition-all shadow-md ${grad}`}>Comenzar Chat</button>
                  <p className={`text-xs text-center ${dark ? 'text-slate-500' : 'text-gray-500'}`}>Tu email solo se usa para personalizar la experiencia</p>
                </form>
              </div>
            </div>
          ) : (
            <>
              <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${dark ? 'bg-[#0A0C12]' : 'bg-gray-50'}`}>
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? (dark ? 'bg-[#4C8DFF] text-white rounded-br-sm' : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-sm')
                        : (dark ? 'bg-[#10131c] text-slate-100 border border-white/10 rounded-bl-sm' : 'bg-white text-gray-800 shadow-md rounded-bl-sm border border-gray-100')
                    }`}>
                      {message.role === 'assistant' ? (
                        <div className="prose prose-sm max-w-none">
                          <ReactMarkdown remarkPlugins={[remarkGfm]} components={md as any}>{message.content || ''}</ReactMarkdown>
                          {message.toolCalls?.map((toolCall: any, index: number) => (
                            <div key={index} className="mt-3">{renderToolCall(toolCall)}</div>
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
                    <div className={`rounded-2xl rounded-bl-sm px-4 py-3 ${dark ? 'bg-[#10131c] border border-white/10' : 'bg-white shadow-md border border-gray-100'}`}>
                      <div className="flex items-center space-x-2">
                        <Loader2 className={`w-4 h-4 animate-spin ${dark ? 'text-[#4C8DFF]' : 'text-purple-600'}`} />
                        <span className={`text-sm ${dark ? 'text-slate-400' : 'text-gray-500'}`}>Pensando…</span>
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="flex justify-start">
                    <div className="bg-red-50 text-red-800 shadow-md rounded-2xl rounded-bl-sm px-4 py-3 border border-red-200">
                      <p className="text-sm"><strong>Error:</strong> {error.message || 'Hubo un problema al conectar. Intenta de nuevo.'}</p>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className={`p-4 ${dark ? 'bg-[#10131c] border-t border-white/10' : 'bg-white border-t border-gray-200'}`}>
                <form onSubmit={handleSubmit} className="flex items-end space-x-2">
                  <textarea
                    value={input || ''} onChange={handleInputChange} onKeyPress={handleKeyPress}
                    placeholder="Escribe tu pregunta..."
                    className={`flex-1 px-4 py-3 rounded-xl border outline-none resize-none transition-all ${
                      dark
                        ? 'bg-[#0A0C12] text-slate-100 placeholder-slate-500 border-white/15 focus:border-[#4C8DFF] focus:ring-2 focus:ring-[#4C8DFF]/30'
                        : 'border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200'
                    }`}
                    rows={1} style={{ minHeight: '48px', maxHeight: '120px' }} disabled={isLoading}
                  />
                  <button
                    type="submit" disabled={!input || !input.trim() || isLoading}
                    className={`p-3 rounded-xl transition-all ${
                      input && input.trim() && !isLoading ? `${grad} text-white shadow-md` : (dark ? 'bg-white/10 text-slate-500 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed')
                    }`}
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  </button>
                </form>
                <p className={`text-xs mt-2 text-center ${dark ? 'text-slate-500' : 'text-gray-400'}`}>Enter para enviar • Shift + Enter para nueva línea</p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default AIChatBubble;
