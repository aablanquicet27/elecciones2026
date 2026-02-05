import React from 'react';
import { TrendingUp, TrendingDown, Users, Award, MapPin, Briefcase } from 'lucide-react';

export interface CandidateData {
  nombre: string;
  intencionVoto: number;
  tendenciaPolitica: string;
  favorabilidad: number;
  desfavorabilidad: number;
  partido: string;
  region: string;
  profesion: string;
  edad: number;
  ranking: number;
}

export const CandidateCard: React.FC<{ candidate: CandidateData }> = ({ candidate }) => {
  const getTendenciaColor = (tendencia: string) => {
    switch (tendencia.toLowerCase()) {
      case 'izquierda':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'derecha':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'centro':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getTrendIcon = () => {
    if (candidate.intencionVoto > 10) {
      return <TrendingUp className="w-4 h-4 text-green-600" />;
    } else if (candidate.intencionVoto < 5) {
      return <TrendingDown className="w-4 h-4 text-red-600" />;
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 max-w-md">
      {/* Header con ranking */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Award className="w-5 h-5 text-yellow-300" />
          <span className="text-white font-bold text-sm">Posición #{candidate.ranking}</span>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getTendenciaColor(candidate.tendenciaPolitica)}`}>
          {candidate.tendenciaPolitica}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="p-5">
        {/* Nombre y partido */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{candidate.nombre}</h3>
          <p className="text-sm text-gray-600 font-medium">{candidate.partido}</p>
        </div>

        {/* Métricas principales */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-600 font-medium">Intención de Voto</span>
              {getTrendIcon()}
            </div>
            <div className="text-2xl font-bold text-purple-700">{candidate.intencionVoto}%</div>
          </div>

          <div className="bg-green-50 rounded-lg p-3 border border-green-200">
            <span className="text-xs text-gray-600 font-medium block mb-1">Favorabilidad</span>
            <div className="text-2xl font-bold text-green-700">{candidate.favorabilidad}%</div>
          </div>
        </div>

        {/* Barra de favorabilidad vs desfavorabilidad */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Favorabilidad</span>
            <span>Desfavorabilidad</span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden flex">
            <div
              className="bg-gradient-to-r from-green-500 to-green-600"
              style={{ width: `${candidate.favorabilidad}%` }}
            />
            <div
              className="bg-gradient-to-r from-red-500 to-red-600"
              style={{ width: `${candidate.desfavorabilidad}%` }}
            />
          </div>
          <div className="flex justify-between text-xs font-semibold mt-1">
            <span className="text-green-600">{candidate.favorabilidad}%</span>
            <span className="text-red-600">{candidate.desfavorabilidad}%</span>
          </div>
        </div>

        {/* Información adicional */}
        <div className="space-y-2 pt-3 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-sm text-gray-700">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span>{candidate.region}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-700">
            <Briefcase className="w-4 h-4 text-gray-500" />
            <span>{candidate.profesion}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-700">
            <Users className="w-4 h-4 text-gray-500" />
            <span>{candidate.edad} años</span>
          </div>
        </div>
      </div>
    </div>
  );
};
