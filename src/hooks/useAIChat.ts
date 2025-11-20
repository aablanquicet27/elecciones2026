import { useChat } from '@ai-sdk/react';
import { parseCandidatesData } from '../lib/ai-tools';

// Generar contexto del sistema con datos actualizados del CSV
const generateSystemContext = () => {
  const candidates = parseCandidatesData();
  const top10 = candidates
    .sort((a, b) => b.intencionVoto - a.intencionVoto)
    .slice(0, 10);

  const contextLines = [
    'Eres un asistente político experto en análisis electoral de Colombia para las elecciones presidenciales 2026.',
    '',
    '**DATOS ELECTORALES ACTUALES (TOP 10 CANDIDATOS):**',
    '',
  ];

  top10.forEach((candidate, index) => {
    contextLines.push(
      `${index + 1}. **${candidate.nombre}** - ${candidate.intencionVoto}% intención de voto, ${candidate.tendenciaPolitica}, ${candidate.favorabilidad}% favorabilidad, ${candidate.partido}`
    );
  });

  contextLines.push(
    '',
    '**INSTRUCCIONES:**',
    '- Responde SOLO en español de forma clara, profesional y contextualizada',
    '- Usa formato Markdown para estructurar tus respuestas con encabezados, negritas, listas, etc.',
    '- Cuando sea relevante, utiliza las herramientas disponibles para mostrar tarjetas de candidatos, comparaciones y estadísticas visuales',
    '- Si el usuario pregunta por candidatos específicos, usa `showCandidateCard` para mostrar sus datos',
    '- Para comparaciones entre candidatos, usa `compareCandidates`',
    '- Para mostrar rankings, usa `showTopCandidates`',
    '- Para insights importantes, usa `showInsight`',
    '- Sé proactivo en ofrecer visualizaciones cuando sea apropiado',
    '- Los datos pueden cambiar hasta las elecciones, siempre menciona que son proyecciones actuales',
    '- Usa enumeraciones, viñetas y formato rico para hacer las respuestas más legibles',
  );

  return contextLines.join('\n');
};

export const useAIChat = () => {
  const systemContext = generateSystemContext();

  const chat = useChat({
    api: '/api/chat',
    initialMessages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: '¡Hola! 👋 Soy tu **Asistente Electoral IA** especializado en las elecciones presidenciales de Colombia 2026.\n\n**Puedo ayudarte con:**\n\n• 📊 Análisis de intención de voto y favorabilidad\n• 🔍 Información detallada de candidatos\n• 📈 Comparaciones entre candidatos\n• 🎯 Tendencias políticas y proyecciones\n• 📉 Estadísticas electorales actualizadas\n\n**¿Qué te gustaría saber?**',
      },
    ],
    body: {
      systemContext,
    },
    streamProtocol: 'text',
  });

  return chat;
};
