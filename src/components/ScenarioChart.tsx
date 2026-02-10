import React from 'react';
import { getScenarioData } from '../utils/csvParser';

const ScenarioChart: React.FC = () => {
  const data = getScenarioData();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-6">
        Escenarios de Segunda Vuelta
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((scenario, index) => (
          <div key={scenario.scenario} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-900 text-sm">
                {scenario.scenario}
              </h4>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {scenario.probability}% prob.
              </span>
            </div>
            
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
            
            <div className="mt-4 pt-3 border-t border-gray-100">
              <div className="text-xs text-gray-500 text-center">
                {scenario.percentage1 > scenario.percentage2 ? 
                  `${scenario.candidate1} aventaja por ${(scenario.percentage1 - scenario.percentage2).toFixed(1)} puntos` :
                  `${scenario.candidate2} aventaja por ${(scenario.percentage2 - scenario.percentage1).toFixed(1)} puntos`
                }
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Análisis de Competitividad</h4>
            <ul className="space-y-2">
              <li>• <strong>Cepeda</strong> es competitivo en segunda vuelta contra todos excepto De la Espriella</li>
              <li>• Cepeda SOLO pierde contra De la Espriella (34.6% vs 36.8%)</li>
              <li>• <strong>De la Espriella</strong> vence a Cepeda por 2.2 puntos y a Fajardo por 10.1 puntos</li>
              <li>• Alta indecisión en todos los escenarios (28.6% - 46.5%)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Factores Determinantes</h4>
            <ul className="space-y-2">
              <li>• <strong>Capacidad de coalición:</strong> Unificación de bloques políticos</li>
              <li>• <strong>Campaña electoral:</strong> Movilización del voto indeciso</li>
              <li>• <strong>Coyuntura económica:</strong> Evaluación del gobierno actual</li>
              <li>• <strong>Dinámicas regionales:</strong> Comportamiento diferenciado por zonas</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Conclusión Clave</h4>
          <p className="text-sm text-blue-800">
            De la Espriella es el candidato más fuerte en segunda vuelta, siendo el único que vence a Cepeda. Sin embargo, el alto porcentaje de indecisos (28-46%) deja espacio para cambios significativos.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScenarioChart;