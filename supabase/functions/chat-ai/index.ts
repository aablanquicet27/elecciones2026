import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Message {
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  tool_calls?: any[];
  tool_call_id?: string;
}

interface ChatRequest {
  messages: Message[];
  systemContext: string;
}

// Herramientas UI (se renderizan en el frontend)
const uiTools = [
  {
    type: 'function',
    function: {
      name: 'showCandidateCard',
      description: 'SOLO usar cuando el usuario pide VER o MOSTRAR información de un candidato por PRIMERA VEZ en la conversación. NO usar para preguntas de seguimiento.',
      parameters: {
        type: 'object',
        properties: {
          candidateName: { type: 'string', description: 'Nombre completo del candidato' },
        },
        required: ['candidateName'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'compareCandidates',
      description: 'SOLO usar cuando el usuario pide explícitamente COMPARAR candidatos.',
      parameters: {
        type: 'object',
        properties: {
          candidateNames: { type: 'array', items: { type: 'string' }, description: 'Lista de nombres de candidatos a comparar' },
          title: { type: 'string', description: 'Título personalizado para la comparación' },
        },
        required: ['candidateNames'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'showTopCandidates',
      description: 'SOLO usar cuando el usuario pide ver un RANKING o TOP de candidatos.',
      parameters: {
        type: 'object',
        properties: {
          count: { type: 'number', description: 'Número de candidatos a mostrar (por defecto 5)' },
          filterBy: { type: 'string', enum: ['intencionVoto', 'favorabilidad'], description: 'Criterio de ordenamiento' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'showElectoralStats',
      description: 'SOLO usar cuando el usuario pide ver estadísticas electorales generales en formato visual.',
      parameters: {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'Título de las estadísticas' },
          stats: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                label: { type: 'string' },
                value: { type: 'string' },
                icon: { type: 'string', enum: ['chart', 'pie', 'trend', 'users'] },
                color: { type: 'string', enum: ['purple', 'blue', 'green', 'red', 'yellow'] },
              },
              required: ['label', 'value'],
            },
            description: 'Lista de estadísticas a mostrar',
          },
          description: { type: 'string', description: 'Descripción adicional' },
        },
        required: ['title', 'stats'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'showInsight',
      description: 'SOLO usar para mostrar un análisis electoral MUY importante que requiera destacarse visualmente.',
      parameters: {
        type: 'object',
        properties: {
          type: { type: 'string', enum: ['insight', 'warning', 'success', 'info'], description: 'Tipo de insight' },
          title: { type: 'string', description: 'Título del insight' },
          message: { type: 'string', description: 'Mensaje principal' },
          details: { type: 'array', items: { type: 'string' }, description: 'Detalles adicionales' },
        },
        required: ['type', 'title', 'message'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'showCandidatesByTendency',
      description: 'SOLO usar cuando el usuario pide ver candidatos filtrados por tendencia política específica.',
      parameters: {
        type: 'object',
        properties: {
          tendency: { type: 'string', enum: ['Izquierda', 'Derecha', 'Centro'], description: 'Tendencia política' },
          limit: { type: 'number', description: 'Número máximo de candidatos a mostrar' },
        },
        required: ['tendency'],
      },
    },
  },
];

// Herramienta server-side: búsqueda en Exa AI (el modelo la invoca, el server la ejecuta)
const searchNewsTool = {
  type: 'function',
  function: {
    name: 'searchNews',
    description: 'Buscar noticias recientes y en tiempo real sobre las elecciones Colombia 2026, candidatos, partidos, encuestas, o cualquier tema político colombiano actual. USA ESTA HERRAMIENTA siempre que el usuario pregunte sobre noticias recientes, últimas noticias, qué está pasando, novedades, o cualquier cosa que requiera información actualizada que no tengas en tus datos.',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'La consulta de búsqueda en español. Debe ser específica sobre el tema que el usuario pregunta. Ejemplo: "encuestas elecciones Colombia 2026 febrero"',
        },
      },
      required: ['query'],
    },
  },
};

const allTools = [...uiTools, searchNewsTool];

// Nombres de tools que se ejecutan server-side (no se pasan al frontend)
const SERVER_TOOLS = new Set(['searchNews']);

async function searchExa(query: string): Promise<string> {
  const exaApiKey = Deno.env.get('EXA_API_KEY');
  if (!exaApiKey) {
    return 'Error: EXA_API_KEY no configurada. No se pueden buscar noticias en tiempo real.';
  }

  try {
    const response = await fetch('https://api.exa.ai/search', {
      method: 'POST',
      headers: {
        'x-api-key': exaApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        numResults: 8,
        category: 'news',
        startPublishedDate: '2026-01-01',
        contents: { text: { maxCharacters: 1500 } },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Exa API error:', errText);
      return `Error buscando noticias: ${response.status}`;
    }

    const data = await response.json();
    const results = data.results || [];

    if (results.length === 0) {
      return 'No se encontraron noticias recientes para esta consulta.';
    }

    const newsText = results.map((r: any, i: number) => {
      const date = r.publishedDate ? r.publishedDate.split('T')[0] : 'Fecha desconocida';
      const source = r.url ? new URL(r.url).hostname.replace('www.', '') : 'Fuente desconocida';
      const text = r.text ? r.text.substring(0, 800) : 'Sin contenido';
      return `**Noticia ${i + 1}** (${date} - ${source}):\nTítulo: ${r.title || 'Sin título'}\n${text}`;
    }).join('\n\n---\n\n');

    return `Se encontraron ${results.length} noticias recientes:\n\n${newsText}`;
  } catch (err) {
    console.error('Error en búsqueda Exa:', err);
    return `Error al buscar noticias: ${err.message}`;
  }
}

// Consume un stream SSE completo y devuelve el mensaje del asistente parseado
async function consumeOpenAIStream(response: Response): Promise<{ content: string; tool_calls: any[] }> {
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let content = '';
  let toolCalls: any[] = [];
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed === 'data: [DONE]') continue;
      if (!trimmed.startsWith('data: ')) continue;

      try {
        const parsed = JSON.parse(trimmed.slice(6));
        const delta = parsed.choices?.[0]?.delta;
        if (delta?.content) content += delta.content;
        if (delta?.tool_calls) {
          for (const tc of delta.tool_calls) {
            const idx = tc.index;
            if (!toolCalls[idx]) {
              toolCalls[idx] = { id: '', type: 'function', function: { name: '', arguments: '' } };
            }
            if (tc.id) toolCalls[idx].id = tc.id;
            if (tc.function?.name) toolCalls[idx].function.name += tc.function.name;
            if (tc.function?.arguments) toolCalls[idx].function.arguments += tc.function.arguments;
          }
        }
      } catch { /* skip */ }
    }
  }

  return { content, tool_calls: toolCalls };
}

async function callOpenAI(messages: any[], openaiApiKey: string, stream: boolean = false) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4-turbo',
      messages,
      stream,
      temperature: 0.7,
      max_tokens: 2000,
      tools: allTools,
      tool_choice: 'auto',
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${error}`);
  }

  return response;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { messages, systemContext }: ChatRequest = await req.json();

    if (!messages || !Array.isArray(messages)) {
      throw new Error('Mensajes inválidos');
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY no está configurada');
    }

    const enhancedSystemContext = `${systemContext || 'Eres un asistente electoral experto.'}

**REGLAS CRÍTICAS PARA USO DE HERRAMIENTAS VISUALES:**

1. **RESPONDE CON TEXTO NATURAL** para:
   - Preguntas de seguimiento sobre un candidato ya mostrado
   - Preguntas puntuales de datos (fechas, números, hechos específicos)
   - Conversaciones generales sobre política
   - Cualquier pregunta que NO pida explícitamente VER o MOSTRAR algo

2. **USA HERRAMIENTAS VISUALES SOLO** cuando el usuario:
   - Pide EXPLÍCITAMENTE ver/mostrar la tarjeta de un candidato por PRIMERA VEZ
   - Pide COMPARAR candidatos específicamente
   - Pide ver un RANKING o TOP de candidatos
   - Pide ver ESTADÍSTICAS en formato visual

3. **NUNCA uses herramientas visuales** para:
   - Preguntas de seguimiento ("cuéntame más", "qué más sabes", "cuándo nació")
   - Datos puntuales que puedes responder con texto
   - Cuando ya mostraste la tarjeta de ese candidato en la conversación

4. **BÚSQUEDA DE NOTICIAS EN TIEMPO REAL:**
   - Usa la herramienta searchNews cuando el usuario pregunte sobre noticias recientes, últimas novedades, qué está pasando, eventos actuales, o cualquier información que requiera datos actualizados
   - Después de obtener los resultados de búsqueda, resume las noticias más relevantes en español de forma clara y organizada
   - Siempre menciona la fuente y fecha de las noticias
   - Puedes combinar searchNews con herramientas visuales si tiene sentido`;

    const allMessages: any[] = [
      { role: 'system', content: enhancedSystemContext },
      ...messages,
    ];

    // Primera llamada a OpenAI (NON-streaming para poder interceptar tool calls)
    const firstResponse = await callOpenAI(allMessages, openaiApiKey, true);
    const firstResult = await consumeOpenAIStream(firstResponse);

    // Check if any tool calls are server-side (searchNews)
    const serverToolCalls = firstResult.tool_calls.filter(
      tc => SERVER_TOOLS.has(tc.function.name)
    );
    const clientToolCalls = firstResult.tool_calls.filter(
      tc => !SERVER_TOOLS.has(tc.function.name)
    );

    // If there are server-side tool calls, execute them and do a follow-up call
    if (serverToolCalls.length > 0) {
      // Build the assistant message with all tool_calls
      const assistantMessage: any = {
        role: 'assistant',
        content: firstResult.content || null,
      };
      if (firstResult.tool_calls.length > 0) {
        assistantMessage.tool_calls = firstResult.tool_calls.map(tc => ({
          id: tc.id,
          type: 'function',
          function: { name: tc.function.name, arguments: tc.function.arguments },
        }));
      }

      const followUpMessages = [...allMessages, assistantMessage];

      // Execute server-side tools and add results
      for (const tc of serverToolCalls) {
        let result = '';
        if (tc.function.name === 'searchNews') {
          let args: any = {};
          try { args = JSON.parse(tc.function.arguments); } catch { /* */ }
          result = await searchExa(args.query || 'elecciones Colombia 2026');
        }
        followUpMessages.push({
          role: 'tool',
          tool_call_id: tc.id,
          content: result,
        });
      }

      // For client-side tool calls that happened alongside, provide dummy results
      for (const tc of clientToolCalls) {
        followUpMessages.push({
          role: 'tool',
          tool_call_id: tc.id,
          content: 'OK - rendered on client',
        });
      }

      // Second call - this time streaming to the client
      const secondResponse = await callOpenAI(followUpMessages, openaiApiKey, true);

      // We need to also forward the client tool calls from the first response
      // Create a custom stream that prepends client tool call info
      if (clientToolCalls.length > 0) {
        // Merge: send client tool calls as SSE events first, then the second response stream
        const encoder = new TextEncoder();
        const readable = new ReadableStream({
          async start(controller) {
            // Emit synthetic SSE events for client tool calls from first response
            for (let i = 0; i < clientToolCalls.length; i++) {
              const tc = clientToolCalls[i];
              const syntheticDelta = {
                choices: [{
                  delta: {
                    tool_calls: [{
                      index: i,
                      id: tc.id,
                      type: 'function',
                      function: { name: tc.function.name, arguments: tc.function.arguments },
                    }],
                  },
                }],
              };
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(syntheticDelta)}\n\n`));
            }

            // Pipe through the second response
            const reader = secondResponse.body!.getReader();
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              controller.enqueue(value);
            }
            controller.close();
          },
        });

        return new Response(readable, {
          headers: {
            ...corsHeaders,
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
            'X-Accel-Buffering': 'no',
          },
        });
      }

      // No client tool calls from first response, just stream the second response
      return new Response(secondResponse.body, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache, no-transform',
          'Connection': 'keep-alive',
          'X-Accel-Buffering': 'no',
        },
      });
    }

    // No server-side tool calls - need to re-stream the first result to the client
    // Since we already consumed the stream, create a synthetic SSE stream
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      start(controller) {
        // Emit content
        if (firstResult.content) {
          const contentDelta = {
            choices: [{ delta: { content: firstResult.content } }],
          };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(contentDelta)}\n\n`));
        }

        // Emit tool calls
        for (let i = 0; i < firstResult.tool_calls.length; i++) {
          const tc = firstResult.tool_calls[i];
          const tcDelta = {
            choices: [{
              delta: {
                tool_calls: [{
                  index: i,
                  id: tc.id,
                  type: 'function',
                  function: { name: tc.function.name, arguments: tc.function.arguments },
                }],
              },
            }],
          };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(tcDelta)}\n\n`));
        }

        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (error) {
    console.error('Error en chat-ai:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'Error desconocido',
        details: error.toString(),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
