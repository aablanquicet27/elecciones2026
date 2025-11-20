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
      toolCalls: [],
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
      let accumulatedToolCalls: any[] = [];
      let buffer = '';
      let receivedData = false;

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
              receivedData = true;
              
              // Extraer el contenido del delta
              const delta = parsed.choices?.[0]?.delta;
              
              if (delta?.content) {
                accumulatedContent += delta.content;
                
                // Actualizar el mensaje del asistente con el contenido
                setMessages(prev => 
                  prev.map(msg => 
                    msg.id === assistantMessageId
                      ? { ...msg, content: accumulatedContent }
                      : msg
                  )
                );
              }
              
              // Manejar tool calls
              if (delta?.tool_calls) {
                for (const toolCall of delta.tool_calls) {
                  const index = toolCall.index;
                  
                  // Inicializar el tool call si no existe
                  if (!accumulatedToolCalls[index]) {
                    accumulatedToolCalls[index] = {
                      id: toolCall.id || '',
                      type: toolCall.type || 'function',
                      function: {
                        name: '',
                        arguments: '',
                      },
                    };
                  }
                  
                  // Actualizar el ID si está presente
                  if (toolCall.id) {
                    accumulatedToolCalls[index].id = toolCall.id;
                  }
                  
                  // Actualizar el tipo si está presente
                  if (toolCall.type) {
                    accumulatedToolCalls[index].type = toolCall.type;
                  }
                  
                  // Acumular el nombre de la función
                  if (toolCall.function?.name) {
                    accumulatedToolCalls[index].function.name += toolCall.function.name;
                  }
                  
                  // Acumular los argumentos
                  if (toolCall.function?.arguments) {
                    accumulatedToolCalls[index].function.arguments += toolCall.function.arguments;
                  }
                }
                
                // Actualizar el mensaje con los tool calls acumulados
                // NO parseamos los argumentos aquí porque pueden estar incompletos
                setMessages(prev => 
                  prev.map(msg => 
                    msg.id === assistantMessageId
                      ? { 
                          ...msg, 
                          content: accumulatedContent,
                          toolCalls: accumulatedToolCalls.map(tc => {
                            // Intentar parsear solo si los argumentos parecen completos
                            let parsedArgs = {};
                            try {
                              if (tc.function.arguments && tc.function.arguments.trim()) {
                                parsedArgs = JSON.parse(tc.function.arguments);
                              }
                            } catch (e) {
                              // Si falla el parsing, dejamos los args vacíos
                              // Se parseará en el siguiente chunk
                              parsedArgs = {};
                            }
                            
                            return {
                              toolName: tc.function.name,
                              args: parsedArgs,
                            };
                          }),
                        }
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

      // Al finalizar el stream, hacer un parsing final de los tool calls
      if (accumulatedToolCalls.length > 0) {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === assistantMessageId
              ? { 
                  ...msg, 
                  content: accumulatedContent,
                  toolCalls: accumulatedToolCalls.map(tc => {
                    let parsedArgs = {};
                    try {
                      if (tc.function.arguments && tc.function.arguments.trim()) {
                        parsedArgs = JSON.parse(tc.function.arguments);
                      }
                    } catch (e) {
                      console.error('Error parseando argumentos finales:', e, 'Args:', tc.function.arguments);
                    }
                    
                    return {
                      toolName: tc.function.name,
                      args: parsedArgs,
                    };
                  }),
                }
              : msg
          )
        );
      }

      // Si no se recibió ningún dato, mostrar error
      if (!receivedData) {
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
