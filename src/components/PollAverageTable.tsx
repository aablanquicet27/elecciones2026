import React from 'react';
import { calculateAverages, encuestasRecientes } from '../data/pollAverages';
import { ExternalLink } from 'lucide-react';

const PollAverageTable: React.FC = () => {
  const averages = calculateAverages();

  const getPositionColor = (index: number) => {
    switch (index) {
      case 0: return 'bg-purple-100 text-purple-800 font-bold';
      case 1: return 'bg-indigo-100 text-indigo-800 font-bold';
      case 2: return 'bg-blue-100 text-blue-800 font-semibold';
      case 3: return 'bg-sky-100 text-sky-800 font-semibold';
      default: return 'bg-gray-50 text-gray-700 font-medium';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden my-8">
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Promedio de Encuestas — Primera Vuelta Presidencial 2026
        </h2>
        <p className="text-gray-600">
          Basado en las 4 encuestadoras más recientes (abril 2026): Invamer/Caracol, AtlasIntel/Semana, Guarumo/EcoAnalítica y GAD3/RCN
        </p>
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-sm uppercase tracking-wider text-gray-500">
              <th className="p-4 font-semibold">Candidato</th>
              <th className="p-4 font-bold text-gray-700 bg-gray-100">Promedio</th>
              {encuestasRecientes.map((encuesta, idx) => (
                <th key={idx} className="p-4 font-medium hover:text-indigo-600 transition-colors">
                  <a
                    href={encuesta.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                    title="Ver fuente"
                  >
                    {encuesta.encuestadora}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {averages.map((candidate, idx) => (
              <tr key={candidate.candidato} className="hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <div className="font-medium text-gray-900">{candidate.candidato}</div>
                  <div className="text-xs text-gray-500">{candidate.partido}</div>
                </td>
                <td className={`p-4 text-center text-lg ${getPositionColor(idx)}`}>
                  {candidate.promedio.toFixed(1)}%
                </td>
                {candidate.encuestas.map((encuesta, eIdx) => (
                  <td key={eIdx} className="p-4 text-gray-600">
                    {encuesta.porcentaje > 0 ? `${encuesta.porcentaje.toFixed(1)}%` : '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden divide-y divide-gray-100">
        {averages.map((candidate, idx) => (
          <div key={candidate.candidato} className="p-4 bg-white">
            <div className="flex justify-between items-center mb-3">
              <div>
                <div className="font-bold text-lg text-gray-900">{candidate.candidato}</div>
                <div className="text-xs text-gray-500">{candidate.partido}</div>
              </div>
              <div className={`px-4 py-2 rounded-lg text-xl ${getPositionColor(idx)}`}>
                {candidate.promedio.toFixed(1)}%
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              {candidate.encuestas.map((encuesta, eIdx) => (
                <div key={eIdx} className="bg-gray-50 p-2 rounded flex justify-between">
                  <span className="text-gray-500 font-medium truncate pr-2" title={encuesta.encuestadora}>
                    {encuesta.encuestadora.split('/')[0]}
                  </span>
                  <span className="font-semibold text-gray-700">
                    {encuesta.porcentaje > 0 ? `${encuesta.porcentaje.toFixed(1)}%` : '-'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 bg-gray-50 border-t border-gray-200">
        <p className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
          Nota: Última actualización: 1 de mayo de 2026. Los promedios se calculan con las 4 encuestas más recientes publicadas (abril 2026).
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {encuestasRecientes.map((encuesta, idx) => (
            <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm text-xs">
              <a
                href={encuesta.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-indigo-700 hover:text-indigo-900 flex items-center justify-between mb-1"
              >
                {encuesta.encuestadora}
                <ExternalLink className="h-3 w-3" />
              </a>
              <div className="text-gray-600 flex flex-col gap-0.5">
                <span><span className="font-medium text-gray-500">Fecha:</span> {encuesta.fecha}</span>
                <span><span className="font-medium text-gray-500">Muestra:</span> {encuesta.muestra.toLocaleString()}</span>
                <span><span className="font-medium text-gray-500">Margen:</span> {encuesta.margenError}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PollAverageTable;
