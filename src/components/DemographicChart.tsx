import React from 'react';
import { getDemographicData } from '../utils/csvParser';

const DemographicChart: React.FC = () => {
  const data = getDemographicData();
  const candidates = ['Bolívar', 'Fajardo', 'Dávila'];
  const colors = ['#ef4444', '#3b82f6', '#22c55e'];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-6">
        Análisis Demográfico por Edad
      </h3>
      
      <div className="space-y-6">
        {data.map((ageGroup) => (
          <div key={ageGroup.ageGroup} className="group">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                {ageGroup.ageGroup}
              </span>
              <div className="flex items-center space-x-3 text-sm">
                {candidates.map((candidate, index) => (
                  <span key={candidate} className="font-semibold" style={{ color: colors[index] }}>
                    {candidate}: {ageGroup[candidate as keyof typeof ageGroup]}%
                  </span>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="flex space-x-1">
                {candidates.map((candidate, index) => (
                  <div key={candidate} className="flex-1">
                    <div className="w-full bg-gray-200 rounded h-4 overflow-hidden">
                      <div
                        className="h-full transition-all duration-1000 ease-out"
                        style={{
                          backgroundColor: colors[index],
                          width: `${(ageGroup[candidate as keyof typeof ageGroup] / 20) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          <p className="mb-2">
            <strong>Hallazgos clave:</strong>
          </p>
          <ul className="space-y-1 text-xs">
            <li>• Bolívar domina el voto joven (18.5% en 18-24 años)</li>
            <li>• Dávila lidera en adultos mayores (14.2% en 55+ años)</li>
            <li>• Fajardo mantiene estabilidad en todos los grupos</li>
            <li>• Evidencia clara de polarización generacional</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DemographicChart;