import { useState, useCallback, useRef } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  toolCalls?: any[];
}

interface UseOpenAIChatOptions {
  api: string;
  headers?: Record<string, string>;
  body?: Record<string, any>;
  initialMessages?: Message[];
  onError?: (error: Error) => void;
}

interface UseOpenAIChatReturn {
  messages: Message[];
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
  setInput: (value: string) => void;
}

export function useOpenAIChat(options: UseOpenAIChatOptions): UseOpenAIChatReturn {
  const { api, headers = {}, body = {}, initialMessages = [], onError } = options;
  
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInput(e.target.value);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input || !input.trim() || isLoading) {
      return;
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
    };

    // Agregar mensaje del usuario
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    // Crear mensaje del asistente vacío
    const assistantMessageId = `assistant-${Date.now()}`;
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
    };
    
    setMessages(prev => [...prev, assistantMessage]);

    try {
      // Crear AbortController para poder cancelar la petición
      abortControllerRef.current = new AbortController();

      // Preparar mensajes para enviar (sin el mensaje del asistente vacío)
      const messagesToSend = [...messages, userMessage].map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await fetch(api, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: JSON.stringify({
          messages: messagesToSend,
          ...body,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No se pudo obtener el reader del stream');
      }

      const decoder = new TextDecoder();
      let accumulatedContent = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          break;
        }

        // Decodificar el chunk
        const text = decoder.decode(value, { stream: true });
        buffer += text;

        // Procesar líneas completas
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Guardar la última línea incompleta

        for (const line of lines) {
          const trimmedLine = line.trim();
          
          if (!trimmedLine || trimmedLine === 'data: [DONE]') {
            continue;
          }

          if (trimmedLine.startsWith('data: ')) {
            const data = trimmedLine.slice(6);
            
            try {
              const parsed = JSON.parse(data);
              
              // Extraer el contenido del delta
              const delta = parsed.choices?.[0]?.delta;
              if (delta?.content) {
                accumulatedContent += delta.content;
                
                // Actualizar el mensaje del asistente
                setMessages(prev => 
                  prev.map(msg => 
                    msg.id === assistantMessageId
                      ? { ...msg, content: accumulatedContent }
                      : msg
                  )
                );
              }
            } catch (parseError) {
              console.error('Error parseando JSON:', parseError, 'Data:', data);
            }
          }
        }
      }

      // Si no se acumuló contenido, mostrar error
      if (!accumulatedContent) {
        throw new Error('No se recibió respuesta del servidor');
      }

    } catch (err) {
      const error = err as Error;
      
      // Ignorar errores de abort
      if (error.name === 'AbortError') {
        return;
      }

      console.error('Error en chat:', error);
      setError(error);
      
      // Remover el mensaje del asistente vacío
      setMessages(prev => prev.filter(msg => msg.id !== assistantMessageId));
      
      if (onError) {
        onError(error);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [input, isLoading, messages, api, headers, body, onError]);

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    setInput,
  };
}
