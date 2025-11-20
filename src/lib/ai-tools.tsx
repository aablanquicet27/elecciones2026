import { z } from 'zod';
import { CandidateCard } from '../components/chat/CandidateCard';
import { CandidateComparison } from '../components/chat/CandidateComparison';
import { ElectoralStats } from '../components/chat/ElectoralStats';
import { ElectoralInsight } from '../components/chat/ElectoralInsight';

// Cargar datos de candidatos desde el CSV
import candidatosData from '../../public/candidatos_presidenciales_2026_completo.csv?raw';

// Parsear CSV a JSON
export const parseCandidatesData = () => {
  const lines = candidatosData.trim().split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    return {
      nombre: values[0]?.trim() || '',
      intencionVoto: parseFloat(values[1]) || 0,
      tendenciaPolitica: values[2]?.trim() || '',
      favorabilidad: parseFloat(values[3]) || 0,
      desfavorabilidad: parseFloat(values[4]) || 0,
      partido: values[5]?.trim() || '',
      region: values[6]?.trim() || '',
      profesion: values[7]?.trim() || '',
      edad: parseInt(values[8]) || 0,
      ranking: parseFloat(values[9]) || 0,
    };
  });
};

// Herramientas de AI para generative UI
export const aiTools = {
  // Mostrar tarjeta de candidato individual
  showCandidateCard: {
    description: 'Muestra una tarjeta detallada de un candidato presidencial específico con sus métricas electorales',
    parameters: z.object({
      candidateName: z.string().describe('Nombre completo del candidato'),
    }),
    generate: async function* ({ candidateName }: { candidateName: string }) {
      yield <div className="text-sm text-gray-500 italic">Buscando información de {candidateName}...</div>;
      
      const candidates = parseCandidatesData();
      const candidate = candidates.find(c => 
        c.nombre.toLowerCase().includes(candidateName.toLowerCase())
      );
      
      if (!candidate) {
        return <div className="text-sm text-red-600">No se encontró información del candidato {candidateName}</div>;
      }
      
      return <CandidateCard candidate={candidate} />;
    },
  },

  // Comparar múltiples candidatos
  compareCandidates: {
    description: 'Compara múltiples candidatos presidenciales mostrando sus métricas lado a lado',
    parameters: z.object({
      candidateNames: z.array(z.string()).describe('Lista de nombres de candidatos a comparar'),
      title: z.string().optional().describe('Título personalizado para la comparación'),
    }),
    generate: async function* ({ candidateNames, title }: { candidateNames: string[]; title?: string }) {
      yield <div className="text-sm text-gray-500 italic">Preparando comparación...</div>;
      
      const allCandidates = parseCandidatesData();
      const candidates = candidateNames
        .map(name => allCandidates.find(c => c.nombre.toLowerCase().includes(name.toLowerCase())))
        .filter(Boolean)
        .map(c => ({
          nombre: c!.nombre,
          intencionVoto: c!.intencionVoto,
          favorabilidad: c!.favorabilidad,
          tendenciaPolitica: c!.tendenciaPolitica,
          partido: c!.partido,
        }));
      
      if (candidates.length === 0) {
        return <div className="text-sm text-red-600">No se encontraron candidatos para comparar</div>;
      }
      
      return <CandidateComparison candidates={candidates} title={title} />;
    },
  },

  // Mostrar top candidatos
  showTopCandidates: {
    description: 'Muestra los candidatos con mayor intención de voto en formato de comparación',
    parameters: z.object({
      count: z.number().default(5).describe('Número de candidatos a mostrar (por defecto 5)'),
      filterBy: z.enum(['intencionVoto', 'favorabilidad']).optional().describe('Criterio de ordenamiento'),
    }),
    generate: async function* ({ count, filterBy = 'intencionVoto' }: { count: number; filterBy?: string }) {
      yield <div className="text-sm text-gray-500 italic">Analizando candidatos principales...</div>;
      
      const candidates = parseCandidatesData()
        .sort((a, b) => {
          if (filterBy === 'favorabilidad') {
            return b.favorabilidad - a.favorabilidad;
          }
          return b.intencionVoto - a.intencionVoto;
        })
        .slice(0, count)
        .map(c => ({
          nombre: c.nombre,
          intencionVoto: c.intencionVoto,
          favorabilidad: c.favorabilidad,
          tendenciaPolitica: c.tendenciaPolitica,
          partido: c.partido,
        }));
      
      const title = filterBy === 'favorabilidad' 
        ? `Top ${count} Candidatos por Favorabilidad`
        : `Top ${count} Candidatos por Intención de Voto`;
      
      return <CandidateComparison candidates={candidates} title={title} />;
    },
  },

  // Mostrar estadísticas electorales
  showElectoralStats: {
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
    generate: async function* ({ title, stats, description }: any) {
      yield <div className="text-sm text-gray-500 italic">Generando estadísticas...</div>;
      
      return <ElectoralStats title={title} stats={stats} description={description} />;
    },
  },

  // Mostrar insight electoral
  showInsight: {
    description: 'Muestra un análisis o insight electoral destacado con formato especial',
    parameters: z.object({
      type: z.enum(['insight', 'warning', 'success', 'info']).describe('Tipo de insight'),
      title: z.string().describe('Título del insight'),
      message: z.string().describe('Mensaje principal'),
      details: z.array(z.string()).optional().describe('Detalles adicionales en viñetas'),
    }),
    generate: async function* ({ type, title, message, details }: any) {
      yield <div className="text-sm text-gray-500 italic">Analizando datos...</div>;
      
      return <ElectoralInsight type={type} title={title} message={message} details={details} />;
    },
  },

  // Mostrar candidatos por tendencia política
  showCandidatesByTendency: {
    description: 'Muestra candidatos filtrados por tendencia política (izquierda, derecha, centro)',
    parameters: z.object({
      tendency: z.enum(['Izquierda', 'Derecha', 'Centro']).describe('Tendencia política a filtrar'),
      limit: z.number().default(5).describe('Número máximo de candidatos a mostrar'),
    }),
    generate: async function* ({ tendency, limit }: { tendency: string; limit: number }) {
      yield <div className="text-sm text-gray-500 italic">Filtrando candidatos de {tendency}...</div>;
      
      const candidates = parseCandidatesData()
        .filter(c => c.tendenciaPolitica.toLowerCase() === tendency.toLowerCase())
        .sort((a, b) => b.intencionVoto - a.intencionVoto)
        .slice(0, limit)
        .map(c => ({
          nombre: c.nombre,
          intencionVoto: c.intencionVoto,
          favorabilidad: c.favorabilidad,
          tendenciaPolitica: c.tendenciaPolitica,
          partido: c.partido,
        }));
      
      if (candidates.length === 0) {
        return <div className="text-sm text-red-600">No se encontraron candidatos de {tendency}</div>;
      }
      
      return <CandidateComparison candidates={candidates} title={`Candidatos de ${tendency}`} />;
    },
  },
};
