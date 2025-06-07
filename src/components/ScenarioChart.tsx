import React from 'react';
import { getScenarioData } from '../utils/csvParser';

const ScenarioChart: React.FC = () => {
  const data = getScenarioData();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-6">
        Escenarios de Segunda Vuelta
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.map((scenario, index) => (
          <div key={scenario.scenario} className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3 text-center">
              {scenario.scenario}
            </h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  {scenario.candidate1}
                </span>
                <span className="text-lg font-bold text-blue-600">
                  {scenario.percentage1}%
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${scenario.percentage1}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  {scenario.candidate2}
                </span>
                <span className="text-lg font-bold text-green-600">
                  {scenario.percentage2}%
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-600 h-3 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${scenario.percentage2}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Indecisos
                </span>
                <span className="text-lg font-bold text-gray-600">
                  {scenario.undecided}%
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gray-500 h-3 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${scenario.undecided}%` }}
                ></div>
              </div>
            </div>
            
            <div className="mt-3 text-center">
              <span className="text-xs text-gray-500">
                Probabilidad: {25 - index * 5}%
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          <p className="mb-2">
            <strong>Análisis de competitividad:</strong>
          </p>
          <ul className="space-y-1 text-xs">
            <li>• Sergio Fajardo emerge como el más competitivo en segunda vuelta</li>
            <li>• Su bajo rechazo (32%) lo posiciona favorablemente</li>
            <li>• Alta indecisión en todos los escenarios (9.7% - 26.2%)</li>
            <li>• Factores coyunturales serán determinantes</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ScenarioChart;