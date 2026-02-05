import React from 'react';
import { Candidate } from '../types/election';

interface VotingIntentionChartProps {
  candidates: Candidate[];
  limit?: number;
}

const VotingIntentionChart: React.FC<VotingIntentionChartProps> = ({ 
  candidates, 
  limit = 10 
}) => {
  const topCandidates = candidates
    .sort((a, b) => b.Intención_Voto_Porcentaje - a.Intención_Voto_Porcentaje)
    .slice(0, limit);

  const maxPercentage = Math.max(...topCandidates.map(c => c.Intención_Voto_Porcentaje));

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'Izquierda': return 'bg-red-500';
      case 'Centro': return 'bg-blue-500';
      case 'Derecha': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">
          Intención de Voto - Top {limit}
        </h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Izquierda</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Centro</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Derecha</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        {topCandidates.map((candidate, index) => (
          <div key={candidate.Candidato} className="group">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-600 w-6">
                  #{index + 1}
                </span>
                <span className="font-medium text-gray-900 group-hover:text-teal-600 transition-colors">
                  {candidate.Candidato}
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                  {candidate.Tendencia_Política}
                </span>
              </div>
              <span className="font-bold text-lg text-gray-900">
                {candidate.Intención_Voto_Porcentaje}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full ${getTrendColor(candidate.Tendencia_Política)} transition-all duration-1000 ease-out rounded-full`}
                style={{
                  width: `${(candidate.Intención_Voto_Porcentaje / maxPercentage) * 100}%`
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VotingIntentionChart;