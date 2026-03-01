import React from 'react';
import { BookOpen, ExternalLink, Info } from 'lucide-react';

const sources = [
  {
    name: 'Fundación PARES (Paz y Reconciliación)',
    title: '"Candidatas y candidatos cuestionados al Congreso de la República 2026"',
    url: 'https://www.pares.com.co/candidatas-y-candidatos-cuestionados-al-congreso-de-la-republica-2026/',
    note: 'Fuente de: 195 candidaturas cuestionadas, 78 al Senado, 111 a Cámara'
  },
  {
    name: 'Infobae Colombia',
    title: '"Candidatos al Congreso que llegan a las urnas con cuentas pendientes ante la justicia"',
    url: 'https://www.infobae.com/colombia/2026/02/20/elecciones-2026-los-candidatos-al-congreso-que-llegan-a-las-urnas-con-cuentas-pendientes-ante-la-justicia/'
  },
  {
    name: 'Cambio Colombia',
    title: 'Investigación candidatos cuestionados con procesos judiciales',
    url: 'https://cambiocolombia.com/elecciones-colombia-2026/articulo/2026/2/candidatos-cuestionados-elecciones-congreso-2026-investigacion-pares-procesos-judiciales/'
  },
  {
    name: 'MOE (Misión de Observación Electoral)',
    title: 'Informes de riesgo electoral 2026'
  },
  {
    name: 'El Colombiano',
    title: 'Guía de candidatos al Senado 2026'
  },
  {
    name: 'Invamer',
    title: 'Encuestas de intención de voto Feb 2026'
  },
  {
    name: 'Registraduría Nacional del Estado Civil',
    title: 'Listas oficiales inscritas'
  },
  {
    name: 'Wikipedia',
    title: 'Elecciones legislativas de Colombia de 2026',
    note: 'Datos generales: 3144 aspirantes, 103 curules'
  }
];

const SenadoFuentes = () => {
  return (
    <section className="py-24 bg-gray-50 border-t border-gray-200 relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4 mb-8">
            <div className="h-12 w-12 rounded-2xl bg-purple-100 flex items-center justify-center flex-shrink-0">
              <BookOpen className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Fuentes de Información</h2>
              <p className="text-gray-500 mt-1">Metodología y datos utilizados para este análisis</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm mb-10">
            <div className="flex items-start space-x-4">
              <Info className="h-6 w-6 text-indigo-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-gray-700 font-medium leading-relaxed">
                  <span className="font-bold text-gray-900">Importante:</span> Los señalamientos documentados corresponden a investigaciones, denuncias o procesos judiciales activos. Todos los candidatos se presumen inocentes hasta sentencia en firme. Distinguimos entre investigado y condenado.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sources.map((source, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-purple-100 transition-all duration-300"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-2">{source.name}</h3>
                <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                  {source.title}
                </p>
                {source.note && (
                  <p className="text-purple-600 text-xs font-semibold mb-3 bg-purple-50 inline-block px-2.5 py-1 rounded-md">
                    {source.note}
                  </p>
                )}
                {source.url && (
                  <div>
                    <a 
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      <span>Ver fuente original</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SenadoFuentes;
