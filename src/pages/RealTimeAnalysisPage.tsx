import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Vote, RefreshCw, Loader, BarChart2, TrendingUp, Users, PieChart, AlertCircle, Clock, LineChart, MapPin, UserSquare2 } from 'lucide-react';

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

interface HistoricalStats {
  totalPolls: number;
  averageSampleSize: number;
  pollsterCount: number;
  timeSpan: string;
}

interface UpdateResult {
  success: boolean;
  timestamp: string;
  visualizations: Visualization[];
  summary: {
    latestPoll: LatestPoll;
    historicalStats: HistoricalStats;
  };
  error?: string;
}

function RealTimeAnalysisPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [updateResult, setUpdateResult] = useState<UpdateResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'current' | 'historical'>('current');

  // Cargar datos automáticamente al montar la página
  useEffect(() => {
    handleUpdate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          { name: 'analisis_regional_real_2026.png', relativePath: 'visualizations/analisis_regional_real_2026.png', lastModified: now.toISOString() },
          { name: 'analisis_demografico_real_2026.png', relativePath: 'visualizations/analisis_demografico_real_2026.png', lastModified: now.toISOString() }
        ],
        summary: {
          latestPoll: {
            date: "2025-06-08",
            pollster: "Guarumo/EcoAnalítica",
            sample_size: 2159,
            error_margin: "4.0%"
          },
          historicalStats: {
            totalPolls: 156,
            averageSampleSize: 1850,
            pollsterCount: 12,
            timeSpan: "Enero 2024 - Junio 2025"
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
    <>
      {/* Navigation (copied from HomePage for consistency) */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-600 p-2 rounded-lg">
                <Vote className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Colombia 2026</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-sm font-medium text-gray-600 hover:text-purple-600">Inicio</Link>
              <Link to="/analisis" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">Panel Completo</Link>
              <Link to="/analisis-tiempo-real" className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium">Análisis en Vivo</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="min-h-screen bg-gray-50 text-gray-900 pt-32 p-6 md:p-10">
        <div className="max-w-7xl mx-auto">
          <header className="flex flex-col md:flex-row justify-between items-center mb-8 pb-4 border-b border-gray-200">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500 mb-4 md:mb-0">
              Análisis en Tiempo Real
            </h1>
            <div className="flex flex-col items-center">
              <button
                onClick={handleUpdate}
                disabled={isLoading}
                className="flex items-center justify-center px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-semibold shadow-lg transition-transform transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed"
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
            <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-lg mb-6 flex items-center">
              <AlertCircle className="mr-3" />
              <p>{error}</p>
            </div>
          )}

          {!updateResult && !isLoading && (
            <div className="text-center py-20 bg-gray-100 rounded-xl border border-gray-200">
              <BarChart2 className="mx-auto text-gray-500 h-24 w-24 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-800">Bienvenido al Dashboard de Análisis</h2>
              <p className="text-gray-600 mt-2">
                Haz clic en "Actualizar Datos" para obtener las últimas encuestas y visualizaciones.
              </p>
            </div>
          )}
          
          {isLoading && (
            <div className="text-center py-20 bg-gray-100 rounded-xl border border-gray-200">
              <div className="animate-pulse">
                <Loader className="mx-auto text-purple-500 h-24 w-24 mb-4" />
                <h2 className="text-2xl font-semibold text-gray-800">Procesando datos...</h2>
                <p className="text-gray-600 mt-2">
                  Estamos obteniendo y analizando la información más reciente. Esto puede tardar un momento.
                </p>
              </div>
            </div>
          )}

          {updateResult && (
            <div>
              {/* Tabs for Current vs Historical */}
              <div className="flex justify-center mb-8">
                <div className="bg-gray-100 p-1 rounded-xl shadow-inner">
                  <button
                    onClick={() => setActiveTab('current')}
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                      activeTab === 'current'
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-600 hover:text-purple-600'
                    }`}
                  >
                    Datos Actuales
                  </button>
                  <button
                    onClick={() => setActiveTab('historical')}
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                      activeTab === 'historical'
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-600 hover:text-purple-600'
                    }`}
                  >
                    Datos Históricos
                  </button>
                </div>
              </div>

              {/* Current Data View */}
              {activeTab === 'current' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <InfoCard 
                      Icon={Users} 
                      title="Encuestadora" 
                      value={updateResult.summary.latestPoll.pollster} 
                    />
                    <InfoCard 
                      Icon={BarChart2} 
                      title="Tamaño de Muestra" 
                      value={updateResult.summary.latestPoll.sample_size.toLocaleString('es-CO')} 
                    />
                    <InfoCard 
                      Icon={PieChart} 
                      title="Margen de Error" 
                      value={updateResult.summary.latestPoll.error_margin} 
                    />
                    <InfoCard 
                      Icon={Clock} 
                      title="Fecha de Encuesta" 
                      value={updateResult.summary.latestPoll.date} 
                    />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {updateResult.visualizations
                      .filter(vis => !vis.name.includes('historica') && !vis.name.includes('comparacion'))
                      .map((vis) => (
                        <div key={vis.name} className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100">
                          <h3 className="text-xl font-bold mb-4 capitalize text-gray-900">
                            {vis.name.replace(/_/g, ' ').replace('.png', '')}
                          </h3>
                          <img 
                            src={getImagePath(vis.relativePath)} 
                            alt={vis.name}
                            className="w-full h-auto rounded-lg" 
                          />
                        </div>
                      ))}
                  </div>
                </>
              )}

              {/* Historical Data View */}
              {activeTab === 'historical' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <InfoCard 
                      Icon={BarChart2} 
                      title="Total Encuestas" 
                      value={updateResult.summary.historicalStats.totalPolls.toString()} 
                    />
                    <InfoCard 
                      Icon={Users} 
                      title="Muestra Promedio" 
                      value={updateResult.summary.historicalStats.averageSampleSize.toLocaleString('es-CO')} 
                    />
                    <InfoCard 
                      Icon={TrendingUp} 
                      title="Encuestadoras" 
                      value={updateResult.summary.historicalStats.pollsterCount.toString()} 
                    />
                    <InfoCard 
                      Icon={Clock} 
                      title="Período" 
                      value={updateResult.summary.historicalStats.timeSpan} 
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-8">
                    {/* Historical Evolution */}
                    <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100">
                      <h3 className="text-xl font-bold mb-4 text-gray-900">
                        Evolución Histórica de Intención de Voto
                      </h3>
                      <img 
                        src={getImagePath(updateResult.visualizations.find(v => v.name.includes('historica'))?.relativePath || '')} 
                        alt="Evolución histórica"
                        className="w-full h-auto rounded-lg" 
                      />
                    </div>

                    {/* Pollster Comparison */}
                    <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100">
                      <h3 className="text-xl font-bold mb-4 text-gray-900">
                        Comparación entre Encuestadoras
                      </h3>
                      <img 
                        src={getImagePath(updateResult.visualizations.find(v => v.name.includes('comparacion'))?.relativePath || '')} 
                        alt="Comparación encuestadoras"
                        className="w-full h-auto rounded-lg" 
                      />
                    </div>

                    {/* Regional Analysis */}
                    <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100">
                      <h3 className="text-xl font-bold mb-4 text-gray-900">
                        Análisis Regional
                      </h3>
                      <img 
                        src={getImagePath(updateResult.visualizations.find(v => v.name.includes('regional'))?.relativePath || '')} 
                        alt="Análisis regional"
                        className="w-full h-auto rounded-lg" 
                      />
                    </div>

                    {/* Demographic Analysis */}
                    <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100">
                      <h3 className="text-xl font-bold mb-4 text-gray-900">
                        Análisis Demográfico
                      </h3>
                      <img 
                        src={getImagePath(updateResult.visualizations.find(v => v.name.includes('demografico'))?.relativePath || '')} 
                        alt="Análisis demográfico"
                        className="w-full h-auto rounded-lg" 
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

interface InfoCardProps {
  Icon: React.ElementType;
  title: string;
  value: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ Icon, title, value }) => (
  <div className="bg-white p-6 rounded-xl flex items-center shadow-lg border border-gray-100">
    <div className="bg-purple-600 p-3 rounded-full mr-4">
      <Icon className="h-6 w-6 text-white"/>
    </div>
    <div>
      <p className="text-sm text-gray-600">{title}</p>
      <p className="text-xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

export default RealTimeAnalysisPage;