import React, { useState } from 'react';
import { RefreshCw, Loader, BarChart2, TrendingUp, Users, PieChart, AlertCircle } from 'lucide-react';

// Tipos de datos que esperamos del backend
interface Visualization {
  name: string;
  relativePath: string;
  lastModified: string;
}

interface LatestPoll {
  date: string;
  pollster: string;
  sample_size: number;
  error_margin: string;
}

interface UpdateResult {
  success: boolean;
  timestamp: string;
  visualizations: Visualization[];
  summary: {
    latestPoll: LatestPoll;
  };
  error?: string;
}

function RealTimeAnalysisPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [updateResult, setUpdateResult] = useState<UpdateResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const handleUpdate = async () => {
    setIsLoading(true);
    setError(null);
    setUpdateResult(null);

    try {
      // Simulación de la ejecución de `npm run update-full`
      console.log("Simulando ejecución de 'npm run update-full'...");
      await new Promise(resolve => setTimeout(resolve, 5000));

      const now = new Date();
      const mockResult: UpdateResult = {
        success: true,
        timestamp: now.toISOString(),
        visualizations: [
          { name: 'intencion_voto_real_2026.png', relativePath: 'visualizations/intencion_voto_real_2026.png', lastModified: now.toISOString() },
          { name: 'tendencias_politicas_real_2026.png', relativePath: 'visualizations/tendencias_politicas_real_2026.png', lastModified: now.toISOString() },
          { name: 'evolucion_historica_real_2026.png', relativePath: 'visualizations/evolucion_historica_real_2026.png', lastModified: now.toISOString() },
          { name: 'comparacion_encuestadoras_real_2026.png', relativePath: 'visualizations/comparacion_encuestadoras_real_2026.png', lastModified: now.toISOString() },
        ].filter(v => v.name !== 'evolucion_historica_real_2026.png' && v.name !== 'comparacion_encuestadoras_real_2026.png'), // Temp filter
        summary: {
          latestPoll: {
            date: "2025-06-08",
            pollster: "Guarumo/EcoAnalítica",
            sample_size: 2159,
            error_margin: "4.0%"
          }
        }
      };

      setUpdateResult(mockResult);
      setLastUpdated(new Date().toLocaleString('es-CO'));

    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Ocurrió un error desconocido';
      setError(`Error al actualizar los datos: ${errorMessage}`);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };
  
  const getImagePath = (relativePath: string) => {
    return `/${relativePath}?t=${new Date().getTime()}`;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 pb-4 border-b border-gray-700">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500 mb-4 md:mb-0">
            Análisis en Tiempo Real
          </h1>
          <div className="flex flex-col items-center">
            <button
              onClick={handleUpdate}
              disabled={isLoading}
              className="flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-semibold shadow-lg transition-transform transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin mr-2" />
                  Actualizando...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2" />
                  Actualizar Datos
                </>
              )}
            </button>
            {lastUpdated && <p className="text-sm text-gray-400 mt-2">Última actualización: {lastUpdated}</p>}
          </div>
        </header>

        {error && (
          <div className="bg-red-900 border border-red-700 text-red-200 p-4 rounded-lg mb-6 flex items-center">
            <AlertCircle className="mr-3" />
            <p>{error}</p>
          </div>
        )}

        {!isLoading && !updateResult && (
          <div className="text-center py-20 bg-gray-800 rounded-lg">
            <BarChart2 className="mx-auto text-gray-500 h-24 w-24 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-300">Bienvenido al Dashboard de Análisis</h2>
            <p className="text-gray-400 mt-2">
              Haz clic en "Actualizar Datos" para obtener las últimas encuestas y visualizaciones.
            </p>
          </div>
        )}
        
        {isLoading && (
            <div className="text-center py-20 bg-gray-800 rounded-lg">
                <div className="animate-pulse">
                    <Loader className="mx-auto text-indigo-400 h-24 w-24 mb-4" />
                    <h2 className="text-2xl font-semibold text-gray-300">Procesando datos...</h2>
                    <p className="text-gray-400 mt-2">
                        Estamos obteniendo y analizando la información más reciente. Esto puede tardar un momento.
                    </p>
                </div>
            </div>
        )}

        {updateResult && updateResult.success && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <InfoCard Icon={TrendingUp} title="Encuestadora" value={updateResult.summary.latestPoll.pollster} />
                <InfoCard Icon={Users} title="Tamaño de Muestra" value={updateResult.summary.latestPoll.sample_size.toLocaleString('es-CO')} />
                <InfoCard Icon={PieChart} title="Margen de Error" value={updateResult.summary.latestPoll.error_margin} />
                <InfoCard Icon={BarChart2} title="Fecha de Encuesta" value={updateResult.summary.latestPoll.date} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {updateResult.visualizations.map((vis) => (
                <div key={vis.name} className="bg-gray-800 p-4 rounded-xl shadow-2xl">
                  <h3 className="text-xl font-bold mb-4 capitalize text-gray-200">{vis.name.replace(/_/g, ' ').replace('.png', '')}</h3>
                  <img 
                    src={getImagePath(vis.relativePath)} 
                    alt={vis.name}
                    className="w-full h-auto rounded-lg" 
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface InfoCardProps {
    Icon: React.ElementType;
    title: string;
    value: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ Icon, title, value }) => (
    <div className="bg-gray-800 p-6 rounded-xl flex items-center shadow-lg">
        <div className="bg-indigo-600 p-3 rounded-full mr-4">
            <Icon className="h-6 w-6 text-white"/>
        </div>
        <div>
            <p className="text-sm text-gray-400">{title}</p>
            <p className="text-xl font-bold text-white">{value}</p>
        </div>
    </div>
);

export default RealTimeAnalysisPage;