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

// Definir las herramientas de UI generativa
const tools = [
  {
    type: 'function',
    function: {
      name: 'showCandidateCard',
      description: 'SOLO usar cuando el usuario pide VER o MOSTRAR información de un candidato por PRIMERA VEZ en la conversación. NO usar para preguntas de seguimiento como fechas, datos puntuales o detalles adicionales sobre un candidato ya mencionado.',
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
      description: 'SOLO usar cuando el usuario pide explícitamente COMPARAR candidatos. NO usar para preguntas generales.',
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
      description: 'SOLO usar cuando el usuario pide ver un RANKING o TOP de candidatos.',
      parameters: {
        type: 'object',
        properties: {
          count: {
            type: 'number',
            description: 'Número de candidatos a mostrar (por defecto 5)',
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

    // Preparar los mensajes con el contexto del sistema mejorado
    const enhancedSystemContext = `${systemContext || 'Eres un asistente electoral experto.'}

**REGLAS CRÍTICAS PARA USO DE HERRAMIENTAS VISUALES:**

1. **RESPONDE CON TEXTO NATURAL** para:
   - Preguntas de seguimiento sobre un candidato ya mostrado (ej: "¿cuándo nació?", "háblame más de él")
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
   - Cuando ya mostraste la tarjeta de ese candidato en la conversación`;

    const allMessages = [
      { role: 'system', content: enhancedSystemContext },
      ...messages,
    ];

    // Llamar a OpenAI API con streaming y herramientas
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
        tools: tools,
        tool_choice: 'auto',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${error}`);
    }

    // Retornar el stream directamente con los headers correctos
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
        details: error.toString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
