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
      content: 'Hola, soy tu asistente electoral especializado en Colombia 2026. Tengo acceso a toda la información actualizada sobre candidatos, encuestas, análisis regional y proyecciones. ¿En qué puedo ayudarte?',
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
Eres un asistente electoral especializado en las elecciones presidenciales de Colombia 2026. Tienes acceso completo a la siguiente información actualizada:

DATOS GENERALES DE LA ELECCIÓN:
- Período de encuestas: Abril-Junio 2025
- Muestra: 3,200 personas encuestadas
- Margen de error: ±3.2%
- Cobertura: Nacional
- Total de candidatos registrados: 32
- Indecisos: 21.0% del electorado

CANDIDATOS PRINCIPALES Y SUS DATOS COMPLETOS:

1. GUSTAVO BOLÍVAR (Líder actual)
- Intención de voto: 12.6%
- Tendencia política: Izquierda
- Favorabilidad: 34% | Desfavorabilidad: 48% | Balance: -14
- Partido: Pacto Histórico
- Región de origen: Bogotá
- Cargo actual: Ex-director Prosperidad Social
- Edad: 63 años | Generación: Senior (>60)
- Tipo candidatura: Por partido
- Ranking: #1

2. VICKY DÁVILA
- Intención de voto: 11.6%
- Tendencia política: Derecha
- Favorabilidad: 38% | Desfavorabilidad: 44% | Balance: -6
- Partido: Candidata por firmas
- Región de origen: Valle del Cauca
- Cargo actual: Ex-Directora Semana
- Edad: 58 años | Generación: Mayor (51-60)
- Tipo candidatura: Por firmas
- Ranking: #2
- Líder en redes sociales: 3.6M seguidores totales

3. SERGIO FAJARDO
- Intención de voto: 11.4%
- Tendencia política: Centro
- Favorabilidad: 42% | Desfavorabilidad: 32% | Balance: +10
- Partido: Centro Esperanza
- Región de origen: Antioquia
- Cargo actual: Ex-Gobernador de Antioquia
- Edad: 67 años | Generación: Senior (>60)
- Tipo candidatura: Por partido
- Ranking: #3

4. GERMÁN VARGAS LLERAS
- Intención de voto: 5.6%
- Tendencia política: Derecha
- Favorabilidad: 29% | Desfavorabilidad: 54% | Balance: -25
- Partido: Cambio Radical
- Región de origen: Cundinamarca
- Cargo actual: Ex-Vicepresidente
- Edad: 65 años | Generación: Senior (>60)
- Ranking: #4

5. CLAUDIA LÓPEZ
- Intención de voto: 4.7%
- Tendencia política: Centro
- Favorabilidad: 31% | Desfavorabilidad: 45% | Balance: -14
- Partido: Candidata por firmas
- Región de origen: Bogotá
- Cargo actual: Ex-Alcaldesa de Bogotá
- Edad: 54 años | Generación: Mayor (51-60)
- Ranking: #5
- Redes sociales: 3.5M seguidores totales

6. MARÍA FERNANDA CABAL
- Intención de voto: 4.6%
- Tendencia política: Derecha
- Favorabilidad: 27% | Desfavorabilidad: 56% | Balance: -29
- Partido: Centro Democrático
- Región de origen: Valle del Cauca
- Cargo actual: Senadora
- Edad: 58 años | Generación: Mayor (51-60)
- Ranking: #6

7. MIGUEL URIBE TURBAY
- Intención de voto: 4.5%
- Tendencia política: Derecha
- Favorabilidad: 32% | Desfavorabilidad: 40% | Balance: -8
- Partido: Centro Democrático
- Región de origen: Bogotá
- Cargo actual: Senador
- Edad: 39 años | Generación: Joven (≤40)
- Ranking: #7

8. JUAN MANUEL GALÁN
- Intención de voto: 4.0%
- Tendencia política: Centro
- Favorabilidad: 40% | Desfavorabilidad: 28% | Balance: +12
- Partido: Nuevo Liberalismo
- Región de origen: Bogotá
- Cargo actual: Ex-Senador
- Edad: 61 años | Generación: Senior (>60)
- Ranking: #8

9. DANIEL QUINTERO
- Intención de voto: 3.8%
- Tendencia política: Izquierda
- Favorabilidad: 23% | Desfavorabilidad: 58% | Balance: -35
- Partido: Candidato por firmas
- Región de origen: Antioquia
- Cargo actual: Ex-Alcalde de Medellín
- Edad: 44 años | Generación: Adulto (41-50)
- Ranking: #9

10. MARÍA JOSÉ PIZARRO
- Intención de voto: 2.6%
- Tendencia política: Izquierda
- Favorabilidad: 29% | Desfavorabilidad: 41% | Balance: -12
- Partido: Pacto Histórico
- Región de origen: Bogotá
- Cargo actual: Senadora
- Edad: 46 años | Generación: Adulto (41-50)
- Ranking: #10

ANÁLISIS POR TENDENCIAS POLÍTICAS:
- Izquierda: 23.0% (caída de -17.3 puntos vs 2022)
- Centro: 27.0% (caída de -1.2 puntos vs 2022)
- Derecha: 29.0% (crecimiento de +0.5 puntos vs 2022)
- Otros/Indecisos: 21.0% (aumento de +18.0 puntos vs 2022)

ANÁLISIS REGIONAL:
Caribe:
- Bolívar: 25.9% | Fajardo: 20.1% | Dávila: 8.4% | Cabal: 6.2% | Vargas: 7.5%

Andina:
- Fajardo: 12.8% | Dávila: 12.5% | Bolívar: 10.2% | Cabal: 8.4% | Vargas: 6.2%

Pacífica:
- Bolívar: 15.8% | Fajardo: 14.3% | Dávila: 9.6% | Cabal: 4.1% | Vargas: 4.5%

Orinoquía:
- Dávila: 15.7% | Cabal: 12.3% | Vargas: 8.9% | Fajardo: 8.2% | Bolívar: 5.4%

Amazonía:
- Dávila: 11.2% | Fajardo: 9.5% | Cabal: 9.8% | Bolívar: 8.7% | Vargas: 5.6%

ANÁLISIS DEMOGRÁFICO POR EDAD:
Jóvenes 18-24:
- Bolívar: 18.5% | Fajardo: 10.2% | Dávila: 8.1% | Cabal: 3.5% | Vargas: 2.8%

Adultos 25-34:
- Bolívar: 15.2% | Fajardo: 11.5% | Dávila: 9.5% | Cabal: 4.2% | Vargas: 4.1%

Adultos 35-44:
- Dávila: 12.8% | Fajardo: 12.4% | Bolívar: 11.7% | Vargas: 5.6% | Cabal: 5.1%

Adultos 45-54:
- Dávila: 13.5% | Fajardo: 11.8% | Bolívar: 8.6% | Vargas: 7.3% | Cabal: 6.2%

Adultos Mayores 55+:
- Dávila: 14.2% | Fajardo: 10.9% | Vargas: 8.2% | Bolívar: 7.3% | Cabal: 7.4%

PRESENCIA EN REDES SOCIALES:
1. Vicky Dávila: 3.6M seguidores (Twitter: 1.4M, Instagram: 1.3M, Facebook: 920K)
2. Claudia López: 3.5M seguidores (Twitter: 1.2M, Instagram: 1M, Facebook: 1.3M)
3. Gustavo Bolívar: 1.95M seguidores (Twitter: 950K, Instagram: 500K, Facebook: 500K)
4. Sergio Fajardo: 1.91M seguidores (Twitter: 830K, Instagram: 300K, Facebook: 780K)
5. Daniel Quintero: 1.5M seguidores (Twitter: 800K, Instagram: 352K, Facebook: 350K)

ESCENARIOS DE SEGUNDA VUELTA:
1. Bolívar vs. Dávila (25% probabilidad): Dávila 46.8% vs Bolívar 43.5% (9.7% indecisos)
2. Bolívar vs. Fajardo (20% probabilidad): Fajardo 48.5% vs Bolívar 41.2% (10.3% indecisos)
3. Fajardo vs. Dávila (18% probabilidad): Fajardo 38.6% vs Dávila 35.2% (26.2% indecisos)
4. Dávila vs. Vargas (15% probabilidad): Dávila 37.4% vs Vargas 32.6% (30.0% indecisos)
5. Bolívar vs. Cabal (12% probabilidad): Cabal 44.7% vs Bolívar 42.3% (13.0% indecisos)

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

Responde siempre en español, de manera conversacional y basándote únicamente en esta información. Puedes hacer análisis, comparaciones y proyecciones basadas en estos datos.
`;

  const callOpenAI = async (userMessage: string) => {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer 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`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: SYSTEM_CONTEXT
            },
            {
              role: 'user',
              content: userMessage
            }
          ],
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
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setIsTyping(true);
    
    try {
      const aiResponse = await callOpenAI(inputValue);
      
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
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
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
            placeholder="Pregunta sobre las elecciones Colombia 2026..."
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