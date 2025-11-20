import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';

// Configuración de las herramientas para generative UI
const tools = {
  showCandidateCard: tool({
    description: 'Muestra una tarjeta detallada de un candidato presidencial específico con sus métricas electorales',
    parameters: z.object({
      candidateName: z.string().describe('Nombre completo del candidato'),
    }),
  }),
  
  compareCandidates: tool({
    description: 'Compara múltiples candidatos presidenciales mostrando sus métricas lado a lado',
    parameters: z.object({
      candidateNames: z.array(z.string()).describe('Lista de nombres de candidatos a comparar'),
      title: z.string().optional().describe('Título personalizado para la comparación'),
    }),
  }),
  
  showTopCandidates: tool({
    description: 'Muestra los candidatos con mayor intención de voto en formato de comparación',
    parameters: z.object({
      count: z.number().default(5).describe('Número de candidatos a mostrar (por defecto 5)'),
      filterBy: z.enum(['intencionVoto', 'favorabilidad']).optional().describe('Criterio de ordenamiento'),
    }),
  }),
  
  showElectoralStats: tool({
    description: 'Muestra estadísticas electorales generales o específicas en formato de tarjetas',
    parameters: z.object({
      title: z.string().describe('Título de las estadísticas'),
      stats: z.array(z.object({
        label: z.string(),
        value: z.union([z.string(), z.number()]),
        icon: z.enum(['chart', 'pie', 'trend', 'users']).optional(),
        color: z.enum(['purple', 'blue', 'green', 'red', 'yellow']).optional(),
      })).describe('Lista de estadísticas a mostrar'),
      description: z.string().optional().describe('Descripción adicional'),
    }),
  }),
  
  showInsight: tool({
    description: 'Muestra un análisis o insight electoral destacado con formato especial',
    parameters: z.object({
      type: z.enum(['insight', 'warning', 'success', 'info']).describe('Tipo de insight'),
      title: z.string().describe('Título del insight'),
      message: z.string().describe('Mensaje principal'),
      details: z.array(z.string()).optional().describe('Detalles adicionales en viñetas'),
    }),
  }),
  
  showCandidatesByTendency: tool({
    description: 'Muestra candidatos filtrados por tendencia política (izquierda, derecha, centro)',
    parameters: z.object({
      tendency: z.enum(['Izquierda', 'Derecha', 'Centro']).describe('Tendencia política a filtrar'),
      limit: z.number().default(5).describe('Número máximo de candidatos a mostrar'),
    }),
  }),
};

export async function POST(req: Request) {
  const { messages, systemContext } = await req.json();

  // Usar GPT-5.1 (o gpt-4-turbo como fallback)
  const model = openai('gpt-4-turbo'); // Cambiar a 'gpt-5' cuando esté disponible

  const result = streamText({
    model,
    system: systemContext,
    messages,
    tools,
    maxSteps: 5, // Permitir múltiples pasos para usar herramientas
  });

  return result.toDataStreamResponse();
}
