import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Minimize2, ChevronDown, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
      content: `# ¡Bienvenido a tu Asistente Electoral! 🗳️

**Especializado en las Elecciones Colombia 2026**

Tengo acceso a información actualizada sobre:
* Candidatos y sus perfiles
* Encuestas y tendencias
* Análisis regional detallado
* Proyecciones electorales

¿En qué puedo ayudarte hoy?`,
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  const SYSTEM_CONTEXT = `
Eres un asistente conversacional inteligente y amigable. Aunque tienes especialización en las elecciones presidenciales de Colombia 2026, puedes conversar sobre cualquier tema de manera natural y útil.

INFORMACIÓN ESPECIALIZADA SOBRE ELECCIONES COLOMBIA 2026:

DATOS GENERALES:
- Período de encuestas: Abril-Junio 2025
- Muestra: 3,200 personas encuestadas
- Margen de error: ±3.2%
- Cobertura: Nacional
- Total candidatos registrados: 32
- Indecisos: 21.0% del electorado

CANDIDATOS PRINCIPALES (TOP 10):

1. GUSTAVO BOLÍVAR (Líder actual)
- Intención de voto: 12.6%
- Tendencia política: Izquierda
- Favorabilidad: 34% | Desfavorabilidad: 48% | Balance: -14
- Partido: Pacto Histórico
- Región: Bogotá | Edad: 63 años | Generación: Senior (>60)
- Cargo: Ex-director Prosperidad Social

2. VICKY DÁVILA
- Intención de voto: 11.6%
- Tendencia política: Derecha
- Favorabilidad: 38% | Desfavorabilidad: 44% | Balance: -6
- Partido: Candidata por firmas
- Región: Valle del Cauca | Edad: 58 años
- Cargo: Ex-Directora Semana
- Líder en redes sociales: 3.6M seguidores totales

3. SERGIO FAJARDO
- Intención de voto: 11.4%
- Tendencia política: Centro
- Favorabilidad: 42% | Desfavorabilidad: 32% | Balance: +10
- Partido: Centro Esperanza
- Región: Antioquia | Edad: 67 años
- Cargo: Ex-Gobernador de Antioquia

4. GERMÁN VARGAS LLERAS
- Intención de voto: 5.6%
- Tendencia política: Derecha
- Favorabilidad: 29% | Desfavorabilidad: 54% | Balance: -25
- Partido: Cambio Radical
- Región: Cundinamarca | Edad: 65 años
- Cargo: Ex-Vicepresidente

5. CLAUDIA LÓPEZ
- Intención de voto: 4.7%
- Tendencia política: Centro
- Favorabilidad: 31% | Desfavorabilidad: 45% | Balance: -14
- Partido: Candidata por firmas
- Región: Bogotá | Edad: 54 años
- Cargo: Ex-Alcaldesa de Bogotá
- Redes sociales: 3.5M seguidores totales

6. MARÍA FERNANDA CABAL
- Intención de voto: 4.6%
- Tendencia política: Derecha
- Favorabilidad: 27% | Desfavorabilidad: 56% | Balance: -29
- Partido: Centro Democrático
- Región: Valle del Cauca | Edad: 58 años
- Cargo: Senadora

7. MIGUEL URIBE TURBAY
- Intención de voto: 4.5%
- Tendencia política: Derecha
- Favorabilidad: 32% | Desfavorabilidad: 40% | Balance: -8
- Partido: Centro Democrático
- Región: Bogotá | Edad: 39 años
- Cargo: Senador

8. JUAN MANUEL GALÁN
- Intención de voto: 4.0%
- Tendencia política: Centro
- Favorabilidad: 40% | Desfavorabilidad: 28% | Balance: +12
- Partido: Nuevo Liberalismo
- Región: Bogotá | Edad: 61 años
- Cargo: Ex-Senador

9. DANIEL QUINTERO
- Intención de voto: 3.8%
- Tendencia política: Izquierda
- Favorabilidad: 23% | Desfavorabilidad: 58% | Balance: -35
- Partido: Candidato por firmas
- Región: Antioquia | Edad: 44 años
- Cargo: Ex-Alcalde de Medellín

10. MARÍA JOSÉ PIZARRO
- Intención de voto: 2.6%
- Tendencia política: Izquierda
- Favorabilidad: 29% | Desfavorabilidad: 41% | Balance: -12
- Partido: Pacto Histórico
- Región: Bogotá | Edad: 46 años
- Cargo: Senadora

ANÁLISIS POR TENDENCIAS POLÍTICAS:
- Izquierda: 23.0% (caída de -17.3 puntos vs 2022)
- Centro: 27.0% (caída de -1.2 puntos vs 2022)
- Derecha: 29.0% (crecimiento de +0.5 puntos vs 2022)
- Otros/Indecisos: 21.0% (aumento de +18.0 puntos vs 2022)

ANÁLISIS REGIONAL:
Caribe: Bolívar 25.9% | Fajardo 20.1% | Dávila 8.4%
Andina: Fajardo 12.8% | Dávila 12.5% | Bolívar 10.2%
Pacífica: Bolívar 15.8% | Fajardo 14.3% | Dávila 9.6%
Orinoquía: Dávila 15.7% | Cabal 12.3% | Vargas 8.9%
Amazonía: Dávila 11.2% | Fajardo 9.5% | Cabal 9.8%

ANÁLISIS DEMOGRÁFICO:
Jóvenes 18-24: Bolívar 18.5% | Fajardo 10.2% | Dávila 8.1%
Adultos 25-34: Bolívar 15.2% | Fajardo 11.5% | Dávila 9.5%
Adultos 35-44: Dávila 12.8% | Fajardo 12.4% | Bolívar 11.7%
Adultos 45-54: Dávila 13.5% | Fajardo 11.8% | Bolívar 8.6%
Adultos Mayores 55+: Dávila 14.2% | Fajardo 10.9% | Vargas 8.2%

ESCENARIOS DE SEGUNDA VUELTA:
1. Bolívar vs. Dávila (25% probabilidad): Dávila 46.8% vs Bolívar 43.5%
2. Bolívar vs. Fajardo (20% probabilidad): Fajardo 48.5% vs Bolívar 41.2%
3. Fajardo vs. Dávila (18% probabilidad): Fajardo 38.6% vs Dávila 35.2%
4. Dávila vs. Vargas (15% probabilidad): Dávila 37.4% vs Vargas 32.6%
5. Bolívar vs. Cabal (12% probabilidad): Cabal 44.7% vs Bolívar 42.3%

HALLAZGOS PRINCIPALES:
1. Fragmentación histórica: Ningún candidato supera el 15%
2. Colapso de la izquierda: Caída de 20.3 puntos vs 2022
3. Aumento exponencial de indecisos: +18.0 puntos
4. Factor digital determinante en campañas
5. Polarización generacional marcada
6. Dinámicas regionales diferenciadas
7. Candidatos de centro mejor posicionados para segunda vuelta

CRONOGRAMA ELECTORAL:
- Agosto 2025: Cierre de inscripciones
- Octubre 2025: Inicio campaña oficial
- Mayo 2026: Primera vuelta
- Junio 2026: Segunda vuelta (si es necesaria)

INSTRUCCIONES DE CONVERSACIÓN:
1. Sé natural, amigable y conversacional
2. Puedes hablar de cualquier tema, no solo elecciones
3. Cuando hables de elecciones, usa esta información especializada
4. Mantén un tono profesional pero cercano
5. Haz preguntas de seguimiento cuando sea apropiado
6. Ofrece análisis y perspectivas cuando sea relevante
7. Responde siempre en español
8. Si no sabes algo, admítelo honestamente
9. Puedes hacer chistes apropiados y ser empático
10. Adapta tu respuesta al contexto de la conversación
IMPORTANTE. TIENES EL DERECHO SEGUN LOS DATOS DE DAR TU ANALSIS CRITICO Y REALISTA.NO DIGO QUE TENGAS UNA OPINION POLITICA PERO SI ALGUN DATO ES EVIDENTE PUEDES DAR ALGUN TIPO DE PREDICCION O ANALISIS. SIN TEMOR OBVIEMNTE SE OBJIVO POR AHROA HAY MARGENES GRANDES PERO EJEMPLO EN SEGUNDA VUELTA HAY CANDIDAOS QEU ES MAS PROBLAME QEU GANEN POR NENCIMA DE TRO  ASI QUE TEN ENCUENTA ESOS ESCENARIOS 
Recuerda: Eres un asistente conversacional completo, no solo un bot de elecciones. Puedes ayudar con muchos temas diferentes mientras mantienes tu especialización electoral cuando sea relevante.
`;

  const callOpenAI = async (userMessage: string, conversationHistory: Message[]) => {
    try {
      const recentMessages = conversationHistory.slice(-20);
      
      const messages = [
        {
          role: 'system',
          content: SYSTEM_CONTEXT
        },
        ...recentMessages.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.content
        })),
        {
          role: 'user',
          content: userMessage
        }
      ];

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4.1',
          messages: messages,
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling OpenAI:', error);
      return 'Lo siento, hubo un error al procesar tu consulta. Por favor, intenta de nuevo.';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isLoading) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue('');
    setIsLoading(true);
    setIsTyping(true);
    
    try {
      const aiResponse = await callOpenAI(inputValue, messages);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Lo siento, hubo un error al procesar tu consulta. Por favor, intenta de nuevo.',
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
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
      <div className="bg-gradient-to-r from-purple-700 to-purple-900 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-full">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold">Asistente Inteligente</h3>
            <p className="text-xs text-purple-200">Especialista en Colombia 2026</p>
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
              {message.sender === 'ai' ? (
                <ReactMarkdown
                  className="prose prose-sm max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-800 prose-strong:font-bold prose-strong:text-gray-900"
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({node, ...props}) => <p className="mb-2 last:mb-0 text-gray-800" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-bold text-gray-900" {...props} />,
                    em: ({node, ...props}) => <em className="italic text-gray-800" {...props} />,
                    h1: ({node, ...props}) => <h1 className="text-xl font-bold mb-2 text-gray-900" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-lg font-bold mb-2 text-gray-900" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-base font-bold mb-1 text-gray-900" {...props} />,
                    ol: ({node, ordered, ...props}) => <ol className="list-decimal list-inside mb-2 pl-2 space-y-1" {...props} />,
                    ul: ({node, ordered, ...props}) => <ul className="list-disc list-inside mb-2 pl-2 space-y-1" {...props} />,
                    li: ({node, ordered, ...props}) => (
                      <li className="text-gray-800" {...props}>
                        <span className="ml-1">{props.children}</span>
                      </li>
                    ),
                    a: ({node, ...props}) => <a className="text-purple-600 hover:underline" {...props} />,
                    blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-gray-200 pl-4 italic my-2" {...props} />,
                    code: ({node, inline, ...props}) => 
                      inline ? (
                        <code className="bg-gray-100 rounded px-1 py-0.5 text-sm font-mono" {...props} />
                      ) : (
                        <code className="block bg-gray-100 rounded p-2 text-sm font-mono my-2 whitespace-pre-wrap" {...props} />
                      ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              ) : (
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              )}
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
      
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Pregúntame lo que quieras..."
            className="flex-1 border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-2 rounded-full hover:shadow-md transition-all duration-200 disabled:opacity-50"
            disabled={!inputValue.trim() || isLoading}
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