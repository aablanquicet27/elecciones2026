import React from 'react';
import { Candidate } from '../types/election';

interface FavorabilityChartProps {
  candidates: Candidate[];
  limit?: number;
}

const FavorabilityChart: React.FC<FavorabilityChartProps> = ({ 
  candidates, 
  limit = 8 
}) => {
  const topCandidates = candidates
    .filter(c => c.Favorabilidad > 0 && c.Desfavorabilidad > 0)
    .sort((a, b) => b.Intención_Voto_Porcentaje - a.Intención_Voto_Porcentaje)
    .slice(0, limit);

  const maxValue = Math.max(
    ...topCandidates.flatMap(c => [c.Favorabilidad, c.Desfavorabilidad])
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">
          Favorabilidad vs Desfavorabilidad
        </h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Favorabilidad</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Desfavorabilidad</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        {topCandidates.map((candidate) => {
          const netFavorability = candidate.Favorabilidad - candidate.Desfavorabilidad;
          return (
            <div key={candidate.Candidato} className="group">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                  {candidate.Candidato}
                </span>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-green-600 font-semibold">
                    +{candidate.Favorabilidad}%
                  </span>
                  <span className="text-red-600 font-semibold">
                    -{candidate.Desfavorabilidad}%
                  </span>
                  <span className={`font-bold ${netFavorability >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {netFavorability >= 0 ? '+' : ''}{netFavorability}%
                  </span>
                </div>
              </div>
              
              <div className="relative">
                <div className="flex space-x-1">
                  <div className="flex-1 bg-gray-200 rounded-l-full h-4 overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all duration-1000 ease-out"
                      style={{
                        width: `${(candidate.Favorabilidad / maxValue) * 100}%`
                      }}
                    ></div>
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-r-full h-4 overflow-hidden">
                    <div
                      className="h-full bg-red-500 transition-all duration-1000 ease-out"
                      style={{
                        width: `${(candidate.Desfavorabilidad / maxValue) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FavorabilityChart;