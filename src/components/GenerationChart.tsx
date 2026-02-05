import React from 'react';
import { Candidate } from '../types/election';

interface GenerationChartProps {
  candidates: Candidate[];
}

const GenerationChart: React.FC<GenerationChartProps> = ({ candidates }) => {
  const generationData = candidates.reduce((acc, candidate) => {
    const generation = candidate.Generación;
    if (!acc[generation]) {
      acc[generation] = { count: 0, totalVotes: 0 };
    }
    acc[generation].count += 1;
    acc[generation].totalVotes += candidate.Intención_Voto_Porcentaje;
    return acc;
  }, {} as { [key: string]: { count: number; totalVotes: number } });

  const generationArray = Object.entries(generationData).map(([generation, data]) => ({
    generation,
    count: data.count,
    totalVotes: data.totalVotes,
    averageVotes: data.totalVotes / data.count
  })).sort((a, b) => b.totalVotes - a.totalVotes);

  const maxVotes = Math.max(...generationArray.map(g => g.totalVotes));

  const getGenerationColor = (generation: string) => {
    switch (generation) {
      case 'Joven (≤40)': return 'bg-purple-500';
      case 'Adulto (41-50)': return 'bg-blue-500';
      case 'Mayor (51-60)': return 'bg-green-500';
      case 'Senior (>60)': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-6">
        Análisis por Generación
      </h3>
      
      <div className="space-y-4">
        {generationArray.map((item) => (
          <div key={item.generation} className="group">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                  {item.generation}
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                  {item.count} candidatos
                </span>
              </div>
              <div className="text-right">
                <span className="font-bold text-lg text-gray-900">
                  {item.totalVotes.toFixed(1)}%
                </span>
                <div className="text-xs text-gray-500">
                  Promedio: {item.averageVotes.toFixed(1)}%
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className={`h-full ${getGenerationColor(item.generation)} transition-all duration-1000 ease-out rounded-full`}
                style={{
                  width: `${(item.totalVotes / maxVotes) * 100}%`
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Total candidatos:</span>
            <span className="font-semibold ml-2">{candidates.length}</span>
          </div>
          <div>
            <span className="text-gray-600">Edad promedio:</span>
            <span className="font-semibold ml-2">
              {(candidates.reduce((sum, c) => sum + c.Edad, 0) / candidates.length).toFixed(0)} años
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerationChart;