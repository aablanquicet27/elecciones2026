import React from 'react';
import { getDemographicData } from '../utils/csvParser';

const DemographicChart: React.FC = () => {
  const data = getDemographicData();

  const cepedaGroups = data.filter(d => d.lider.includes('Cepeda'));
  const espriellaGroups = data.filter(d => d.lider.includes('Espriella'));

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-6">
        Análisis Demográfico por Edad
      </h3>

      <div className="space-y-4">
        {data.map((ageGroup) => (
          <div key={ageGroup.ageGroup} className="group">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                {ageGroup.ageGroup}
              </span>
              <div className="flex items-center space-x-2">
                <span
                  className="inline-block w-3 h-3 rounded-full"
                  style={{ backgroundColor: ageGroup.color }}
                ></span>
                <span className="font-semibold text-sm" style={{ color: ageGroup.color }}>
                  {ageGroup.lider.split(' ').pop()}
                </span>
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  backgroundColor: ageGroup.color,
                  width: '100%'
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center space-x-6">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: '#ef4444' }}></span>
          <span className="text-sm text-gray-700 font-medium">Cepeda ({cepedaGroups.length} grupos)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: '#22c55e' }}></span>
          <span className="text-sm text-gray-700 font-medium">Espriella ({espriellaGroups.length} grupos)</span>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Hallazgos Clave por Edad</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• <strong>Jóvenes (18-44):</strong> Cepeda lidera en los tres grupos etarios más jóvenes</li>
              <li>• <strong>Adultos Mayores (45+):</strong> Espriella lidera entre votantes de 45 años en adelante</li>
              <li>• <strong>Polarización generacional:</strong> Clara división entre jóvenes y mayores</li>
              <li>• <strong>Franja decisiva (35-44):</strong> Grupo bisagra donde Cepeda aún mantiene ventaja</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Implicaciones Electorales</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• <strong>Movilización juvenil:</strong> Clave para Cepeda, su base está en menores de 44</li>
              <li>• <strong>Voto adulto mayor:</strong> Espriella consolida entre votantes de 45+</li>
              <li>• <strong>Participación:</strong> Mayores de 45 tienden a votar más, ventaja para Espriella</li>
              <li>• <strong>Estrategias diferenciadas:</strong> Mensajes segmentados por grupo etario</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
          <h4 className="font-semibold text-purple-900 mb-2">Análisis Generacional</h4>
          <p className="text-sm text-purple-800">
            La polarización generacional es evidente: Cepeda lidera entre los votantes jóvenes (18-44),
            mientras Espriella domina entre los adultos mayores (45+). Esta división generacional será
            determinante en la estrategia de movilización electoral, donde la participación de los
            jóvenes podría inclinar la balanza a favor de Cepeda.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DemographicChart;
