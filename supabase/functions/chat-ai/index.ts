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
    return 'Sin contexto de búsqueda disponible.';
  }

  try {
    // Búsqueda general (NO solo noticias) para obtener contexto amplio
    const response = await fetch('https://api.exa.ai/search', {
      method: 'POST',
      headers: {
        'x-api-key': exaApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        numResults: 10,
        useAutoprompt: true,
        contents: { text: { maxCharacters: 2000 } },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Exa API error:', errText);
      return 'Sin contexto de búsqueda disponible.';
    }

    const data = await response.json();
    const results = data.results || [];

    if (results.length === 0) {
      return 'Sin resultados de búsqueda para esta consulta.';
    }

    const resultsText = results.map((r: any, i: number) => {
      const date = r.publishedDate ? r.publishedDate.split('T')[0] : '';
      const source = r.url ? new URL(r.url).hostname.replace('www.', '') : '';
      const dateSource = [date, source].filter(Boolean).join(' - ');
      const text = r.text ? r.text.substring(0, 1200) : '';
      return `[Resultado ${i + 1}] ${dateSource ? `(${dateSource})` : ''}\nTítulo: ${r.title || 'Sin título'}\n${text}`;
    }).join('\n\n---\n\n');

    return resultsText;
  } catch (err) {
    console.error('Error en búsqueda Exa:', err);
    return 'Sin contexto de búsqueda disponible.';
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

// Construir queries de búsqueda Exa basados en el último mensaje del usuario
function buildExaQueries(messages: Message[]): string[] {
  const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
  const userText = lastUserMsg?.content || 'elecciones Colombia 2026';

  // Búsqueda 1: pregunta directa del usuario + Colombia 2026
  // Búsqueda 2: pregunta tal cual del usuario
  return [
    `${userText} Colombia 2026`.substring(0, 300),
    userText.substring(0, 300),
  ];
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
    // Hacer múltiples búsquedas en paralelo para máximo contexto
    const queries = buildExaQueries(messages);
    console.log('Buscando en Exa:', queries);
    const searchResults = await Promise.all(queries.map(q => searchExa(q)));
    const newsContext = searchResults.join('\n\n=== BÚSQUEDA ADICIONAL ===\n\n');

    const enhancedSystemContext = `${systemContext || 'Eres un asistente electoral experto.'}

=== INFORMACIÓN DE BÚSQUEDA EN TIEMPO REAL ===
A continuación tienes resultados de búsqueda en internet actualizados al momento. DEBES usar esta información para responder:

${newsContext}

=== FIN DE BÚSQUEDA ===

**REGLAS ABSOLUTAS E INQUEBRANTABLES:**

1. **PROHIBIDO TERMINANTEMENTE decir "no tengo información", "no sé", "no cuento con datos", "no tengo acceso", "no tengo información específica" o CUALQUIER variación de estas frases.** Los resultados de búsqueda de arriba SON tu información. Analízalos, extrae lo relevante, y RESPONDE. Si no hay un dato exacto, haz análisis y da tu mejor respuesta basándote en lo que SÍ hay en los resultados.

2. **SIEMPRE da una respuesta completa y contextualizada.** Usa los resultados de búsqueda de arriba como tu fuente principal de información. Extrae datos concretos: nombres, cifras, fechas, porcentajes, hechos. No seas vago ni genérico.

3. **Menciona fuentes y fechas** cuando cites información de los resultados de búsqueda (ej: "según semana.com del 28 de febrero...").

4. **Si la pregunta es sobre algo específico** (un candidato al senado, un partido, un escándalo, etc.) y los resultados de búsqueda contienen información relevante, ÚSALA para dar una respuesta detallada y concreta.

5. **Combina todo:** los datos electorales del sistema + los resultados de búsqueda en tiempo real + tu conocimiento general para dar la MEJOR respuesta posible. Nunca dejes al usuario sin respuesta.

**REGLAS PARA HERRAMIENTAS VISUALES:**

- **RESPONDE CON TEXTO NATURAL** para: preguntas de seguimiento, datos puntuales, conversaciones generales, cualquier pregunta que NO pida explícitamente VER o MOSTRAR algo
- **USA HERRAMIENTAS VISUALES SOLO** cuando el usuario pide EXPLÍCITAMENTE ver/mostrar tarjeta de candidato, COMPARAR candidatos, ver RANKING/TOP, o ver ESTADÍSTICAS en formato visual
- **NUNCA uses herramientas visuales** para preguntas de seguimiento o datos puntuales`;

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
