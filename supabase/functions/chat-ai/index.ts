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

const allTools = [...uiTools];

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

// Construir query de búsqueda Exa basado en el último mensaje del usuario
function buildExaQuery(messages: Message[]): string {
  // Tomar el último mensaje del usuario
  const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
  const userText = lastUserMsg?.content || '';

  // Siempre incluir contexto electoral + lo que preguntó el usuario
  return `elecciones presidenciales Colombia 2026 ${userText}`.substring(0, 300);
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

    // SIEMPRE buscar en Exa AI primero para contexto en tiempo real
    const exaQuery = buildExaQuery(messages);
    console.log('Buscando en Exa:', exaQuery);
    const newsContext = await searchExa(exaQuery);

    const enhancedSystemContext = `${systemContext || 'Eres un asistente electoral experto.'}

**CONTEXTO DE NOTICIAS EN TIEMPO REAL (búsqueda actualizada al momento):**
${newsContext}

---

**INSTRUCCIONES:**
- SIEMPRE usa el contexto de noticias en tiempo real de arriba para dar respuestas actualizadas y contextualizadas
- Menciona fuentes y fechas cuando cites noticias
- Combina los datos electorales del sistema con las noticias en tiempo real para dar la mejor respuesta posible
- Si las noticias son relevantes a la pregunta del usuario, inclúyelas en tu respuesta
- Si las noticias no son directamente relevantes, usa tu conocimiento electoral pero igual puedes mencionar brevemente las últimas novedades

**REGLAS PARA HERRAMIENTAS VISUALES:**

1. **RESPONDE CON TEXTO NATURAL** para:
   - Preguntas de seguimiento sobre un candidato ya mostrado
   - Preguntas puntuales de datos
   - Conversaciones generales sobre política
   - Cualquier pregunta que NO pida explícitamente VER o MOSTRAR algo

2. **USA HERRAMIENTAS VISUALES SOLO** cuando el usuario:
   - Pide EXPLÍCITAMENTE ver/mostrar la tarjeta de un candidato por PRIMERA VEZ
   - Pide COMPARAR candidatos específicamente
   - Pide ver un RANKING o TOP de candidatos
   - Pide ver ESTADÍSTICAS en formato visual

3. **NUNCA uses herramientas visuales** para preguntas de seguimiento o datos puntuales`;

    const allMessages: any[] = [
      { role: 'system', content: enhancedSystemContext },
      ...messages,
    ];

    // Llamar a OpenAI con streaming directo al cliente (ya tenemos el contexto de Exa inyectado)
    const response = await callOpenAI(allMessages, openaiApiKey, true);

    return new Response(response.body, {
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
