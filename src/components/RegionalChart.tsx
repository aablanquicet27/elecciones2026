import React from 'react';
import { getRegionalData } from '../utils/csvParser';

const RegionalChart: React.FC = () => {
  const data = getRegionalData();
  const candidates = ['Bolívar', 'Fajardo', 'Dávila', 'Cabal'];
  const colors = ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b'];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-6">
        Comportamiento Electoral Regional
      </h3>
      
      <div className="space-y-6">
        {data.map((region) => (
          <div key={region.region} className="group">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                {region.region}
              </span>
              <div className="flex items-center space-x-3 text-sm">
                {candidates.map((candidate, index) => (
                  <span key={candidate} className="font-semibold" style={{ color: colors[index] }}>
                    {candidate}: {region[candidate as keyof typeof region]}%
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
                          width: `${(region[candidate as keyof typeof region] / 30) * 100}%`
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
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Región más competitiva:</span>
            <span className="font-semibold ml-2">Andina</span>
          </div>
          <div>
            <span className="text-gray-600">Liderazgo más claro:</span>
            <span className="font-semibold ml-2">Caribe (Bolívar)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegionalChart;