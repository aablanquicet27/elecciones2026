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

function parseToolCalls(accumulatedToolCalls: any[]) {
  return accumulatedToolCalls.map(tc => {
    let parsedArgs = {};
    try {
      if (tc.function.arguments?.trim()) {
        parsedArgs = JSON.parse(tc.function.arguments);
      }
    } catch {
      parsedArgs = {};
    }
    return { toolName: tc.function.name, args: parsedArgs };
  });
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

    if (!input?.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    const assistantMessageId = `assistant-${Date.now()}`;
    setMessages(prev => [...prev, { id: assistantMessageId, role: 'assistant', content: '', toolCalls: [] }]);

    try {
      abortControllerRef.current = new AbortController();

      const messagesToSend = [...messages, userMessage].map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await fetch(api, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({ messages: messagesToSend, ...body }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No se pudo obtener el reader del stream');

      const decoder = new TextDecoder();
      let accumulatedContent = '';
      let accumulatedToolCalls: any[] = [];
      let buffer = '';
      let receivedData = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine || trimmedLine === 'data: [DONE]') continue;

          if (trimmedLine.startsWith('data: ')) {
            try {
              const parsed = JSON.parse(trimmedLine.slice(6));
              receivedData = true;
              const delta = parsed.choices?.[0]?.delta;

              if (delta?.content) {
                accumulatedContent += delta.content;
                setMessages(prev =>
                  prev.map(msg =>
                    msg.id === assistantMessageId ? { ...msg, content: accumulatedContent } : msg
                  )
                );
              }

              if (delta?.tool_calls) {
                for (const toolCall of delta.tool_calls) {
                  const idx = toolCall.index;
                  if (!accumulatedToolCalls[idx]) {
                    accumulatedToolCalls[idx] = {
                      id: toolCall.id || '',
                      type: toolCall.type || 'function',
                      function: { name: '', arguments: '' },
                    };
                  }
                  if (toolCall.id) accumulatedToolCalls[idx].id = toolCall.id;
                  if (toolCall.type) accumulatedToolCalls[idx].type = toolCall.type;
                  if (toolCall.function?.name) accumulatedToolCalls[idx].function.name += toolCall.function.name;
                  if (toolCall.function?.arguments) accumulatedToolCalls[idx].function.arguments += toolCall.function.arguments;
                }

                setMessages(prev =>
                  prev.map(msg =>
                    msg.id === assistantMessageId
                      ? { ...msg, content: accumulatedContent, toolCalls: parseToolCalls(accumulatedToolCalls) }
                      : msg
                  )
                );
              }
            } catch {
              // Skip malformed SSE chunks
            }
          }
        }
      }

      if (accumulatedToolCalls.length > 0) {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === assistantMessageId
              ? { ...msg, content: accumulatedContent, toolCalls: parseToolCalls(accumulatedToolCalls) }
              : msg
          )
        );
      }

      if (!receivedData) {
        throw new Error('No se recibio respuesta del servidor');
      }
    } catch (err) {
      const error = err as Error;
      if (error.name === 'AbortError') return;

      setError(error);
      setMessages(prev => prev.filter(msg => msg.id !== assistantMessageId));
      onError?.(error);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [input, isLoading, messages, api, headers, body, onError]);

  return { messages, input, handleInputChange, handleSubmit, isLoading, error, setInput };
}
