import React from 'react';
import { ArrowRight, TrendingUp, Users, Award } from 'lucide-react';

export interface ComparisonData {
  candidates: Array<{
    nombre: string;
    intencionVoto: number;
    favorabilidad: number;
    tendenciaPolitica: string;
    partido: string;
  }>;
  title?: string;
}

export const CandidateComparison: React.FC<ComparisonData> = ({ candidates, title }) => {
  const getTendenciaColor = (tendencia: string) => {
    switch (tendencia.toLowerCase()) {
      case 'izquierda':
        return 'bg-red-500';
      case 'derecha':
        return 'bg-blue-500';
      case 'centro':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden max-w-2xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-600 px-5 py-4">
        <h3 className="text-white font-bold text-lg flex items-center">
          <Award className="w-5 h-5 mr-2" />
          {title || 'Comparación de Candidatos'}
        </h3>
      </div>

      {/* Contenido */}
      <div className="p-5 space-y-4">
        {candidates.map((candidate, index) => (
          <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
            {/* Nombre y partido */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-bold text-gray-900">{candidate.nombre}</h4>
                <p className="text-xs text-gray-600">{candidate.partido}</p>
              </div>
              <div className={`w-3 h-3 rounded-full ${getTendenciaColor(candidate.tendenciaPolitica)}`} />
            </div>

            {/* Métricas */}
            <div className="space-y-2">
              {/* Intención de voto */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-gray-600 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Intención de Voto
                  </span>
                  <span className="text-sm font-bold text-teal-700">{candidate.intencionVoto}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 to-teal-500 rounded-full transition-all duration-500"
                    style={{ width: `${candidate.intencionVoto}%` }}
                  />
                </div>
              </div>

              {/* Favorabilidad */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-gray-600 flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    Favorabilidad
                  </span>
                  <span className="text-sm font-bold text-green-700">{candidate.favorabilidad}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500"
                    style={{ width: `${candidate.favorabilidad}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer con análisis */}
      <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
        <p className="text-xs text-gray-600 flex items-center">
          <ArrowRight className="w-3 h-3 mr-1" />
          Datos actualizados según últimas encuestas
        </p>
      </div>
    </div>
  );
};
