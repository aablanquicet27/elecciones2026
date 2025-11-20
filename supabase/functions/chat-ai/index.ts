import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequest {
  messages: Message[];
  systemContext: string;
}

Deno.serve(async (req: Request) => {
  // Manejar CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { messages, systemContext }: ChatRequest = await req.json();

    // Validar que los mensajes existen
    if (!messages || !Array.isArray(messages)) {
      throw new Error('Mensajes inválidos');
    }

    // Obtener la API key de OpenAI desde las variables de entorno
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY no está configurada');
    }

    // Preparar los mensajes con el contexto del sistema
    const allMessages = [
      { role: 'system', content: systemContext || 'Eres un asistente electoral experto.' },
      ...messages,
    ];

    // Llamar a OpenAI API con streaming
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo',
        messages: allMessages,
        stream: true,
        temperature: 0.7,
        max_tokens: 2000,
        tools: [
          {
            type: 'function',
            function: {
              name: 'showCandidateCard',
              description: 'Muestra una tarjeta detallada de un candidato presidencial específico con sus métricas electorales',
              parameters: {
                type: 'object',
                properties: {
                  candidateName: {
                    type: 'string',
                    description: 'Nombre completo del candidato',
                  },
                },
                required: ['candidateName'],
              },
            },
          },
          {
            type: 'function',
            function: {
              name: 'compareCandidates',
              description: 'Compara múltiples candidatos presidenciales mostrando sus métricas lado a lado',
              parameters: {
                type: 'object',
                properties: {
                  candidateNames: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Lista de nombres de candidatos a comparar',
                  },
                  title: {
                    type: 'string',
                    description: 'Título personalizado para la comparación',
                  },
                },
                required: ['candidateNames'],
              },
            },
          },
          {
            type: 'function',
            function: {
              name: 'showTopCandidates',
              description: 'Muestra los candidatos con mayor intención de voto en formato de comparación',
              parameters: {
                type: 'object',
                properties: {
                  count: {
                    type: 'number',
                    description: 'Número de candidatos a mostrar (por defecto 5)',
                    default: 5,
                  },
                  filterBy: {
                    type: 'string',
                    enum: ['intencionVoto', 'favorabilidad'],
                    description: 'Criterio de ordenamiento',
                  },
                },
              },
            },
          },
          {
            type: 'function',
            function: {
              name: 'showElectoralStats',
              description: 'Muestra estadísticas electorales generales o específicas en formato de tarjetas',
              parameters: {
                type: 'object',
                properties: {
                  title: {
                    type: 'string',
                    description: 'Título de las estadísticas',
                  },
                  stats: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        label: { type: 'string' },
                        value: { type: ['string', 'number'] },
                        icon: {
                          type: 'string',
                          enum: ['chart', 'pie', 'trend', 'users'],
                        },
                        color: {
                          type: 'string',
                          enum: ['purple', 'blue', 'green', 'red', 'yellow'],
                        },
                      },
                    },
                  },
                  description: {
                    type: 'string',
                    description: 'Descripción adicional',
                  },
                },
                required: ['title', 'stats'],
              },
            },
          },
          {
            type: 'function',
            function: {
              name: 'showInsight',
              description: 'Muestra un análisis o insight electoral destacado con formato especial',
              parameters: {
                type: 'object',
                properties: {
                  type: {
                    type: 'string',
                    enum: ['insight', 'warning', 'success', 'info'],
                    description: 'Tipo de insight',
                  },
                  title: {
                    type: 'string',
                    description: 'Título del insight',
                  },
                  message: {
                    type: 'string',
                    description: 'Mensaje principal',
                  },
                  details: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Detalles adicionales en viñetas',
                  },
                },
                required: ['type', 'title', 'message'],
              },
            },
          },
          {
            type: 'function',
            function: {
              name: 'showCandidatesByTendency',
              description: 'Muestra candidatos filtrados por tendencia política (izquierda, derecha, centro)',
              parameters: {
                type: 'object',
                properties: {
                  tendency: {
                    type: 'string',
                    enum: ['Izquierda', 'Derecha', 'Centro'],
                    description: 'Tendencia política a filtrar',
                  },
                  limit: {
                    type: 'number',
                    description: 'Número máximo de candidatos a mostrar',
                    default: 5,
                  },
                },
                required: ['tendency'],
              },
            },
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${error}`);
    }

    // Crear un TransformStream para convertir el formato de OpenAI al formato de Vercel AI SDK
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n').filter(line => line.trim() !== '');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') continue;

                try {
                  const parsed = JSON.parse(data);
                  const delta = parsed.choices?.[0]?.delta;
                  
                  if (delta?.content) {
                    // Formato compatible con Vercel AI SDK
                    const aiSDKChunk = `0:${JSON.stringify(delta.content)}\n`;
                    controller.enqueue(encoder.encode(aiSDKChunk));
                  }

                  if (delta?.tool_calls) {
                    // Enviar tool calls en formato AI SDK
                    for (const toolCall of delta.tool_calls) {
                      if (toolCall.function) {
                        const toolChunk = `9:${JSON.stringify({
                          toolCallId: toolCall.id || `call_${Date.now()}`,
                          toolName: toolCall.function.name,
                          args: toolCall.function.arguments ? JSON.parse(toolCall.function.arguments) : {}
                        })}\n`;
                        controller.enqueue(encoder.encode(toolChunk));
                      }
                    }
                  }
                } catch (e) {
                  console.error('Error parsing chunk:', e);
                }
              }
            }
          }
        } catch (error) {
          console.error('Stream error:', error);
          controller.error(error);
        } finally {
          controller.close();
        }
      },
    });

    // Retornar el stream con los headers correctos para Vercel AI SDK
    return new Response(stream, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('Error en chat-ai:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Error desconocido',
        details: error.toString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
