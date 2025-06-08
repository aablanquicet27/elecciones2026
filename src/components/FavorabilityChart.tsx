import React from 'react';
import { getFavorabilityData } from '../utils/csvParser';

interface FavorabilityChartProps {
  limit?: number;
}

const FavorabilityChart: React.FC<FavorabilityChartProps> = ({ 
  limit = 10 
}) => {
  const data = getFavorabilityData().slice(0, limit);
  const maxValue = Math.max(
    ...data.flatMap(c => [c.favorabilidad, c.desfavorabilidad])
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
        {data.map((candidate) => {
          return (
            <div key={candidate.candidate} className="group">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                  {candidate.candidate}
                </span>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-green-600 font-semibold">
                    +{candidate.favorabilidad}%
                  </span>
                  <span className="text-red-600 font-semibold">
                    -{candidate.desfavorabilidad}%
                  </span>
                  <span className={`font-bold text-lg ${candidate.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {candidate.balance >= 0 ? '+' : ''}{candidate.balance}%
                  </span>
                </div>
              </div>
              
              <div className="relative">
                <div className="flex space-x-1">
                  <div className="flex-1 bg-gray-200 rounded-l-full h-4 overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all duration-1000 ease-out"
                      style={{
                        width: `${(candidate.favorabilidad / maxValue) * 100}%`
                      }}
                    ></div>
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-r-full h-4 overflow-hidden">
                    <div
                      className="h-full bg-red-500 transition-all duration-1000 ease-out"
                      style={{
                        width: `${(candidate.desfavorabilidad / maxValue) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Balance Positivo</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• <strong>Juan Manuel Galán:</strong> +12 puntos (40% vs 28%)</li>
              <li>• <strong>Sergio Fajardo:</strong> +10 puntos (42% vs 32%)</li>
              <li>• <strong>Alejandro Gaviria:</strong> -3 puntos (35% vs 38%)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Mayor Rechazo</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• <strong>Daniel Quintero:</strong> -35 puntos (23% vs 58%)</li>
              <li>• <strong>María F. Cabal:</strong> -29 puntos (27% vs 56%)</li>
              <li>• <strong>Germán Vargas:</strong> -25 puntos (29% vs 54%)</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
          <h4 className="font-semibold text-green-900 mb-2">Competitividad Electoral</h4>
          <p className="text-sm text-green-800">
            Los candidatos con balance positivo de favorabilidad (Galán y Fajardo) tienen 
            mejores perspectivas en segunda vuelta, mientras que aquellos con alto rechazo 
            enfrentan techos electorales que limitan su crecimiento potencial.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FavorabilityChart;