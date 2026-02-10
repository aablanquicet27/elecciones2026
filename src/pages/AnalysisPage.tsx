import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Candidate } from '../types/election';
import StatCard from '../components/StatCard';
import CandidateCard from '../components/CandidateCard';
import VotingIntentionChart from '../components/VotingIntentionChart';
import TrendChart from '../components/TrendChart';
import FavorabilityChart from '../components/FavorabilityChart';
import CandidateTable from '../components/CandidateTable';
import GenerationChart from '../components/GenerationChart';
import ComparisonChart from '../components/ComparisonChart';
import RegionalChart from '../components/RegionalChart';
import DemographicChart from '../components/DemographicChart';
import SocialMediaChart from '../components/SocialMediaChart';
import ScenarioChart from '../components/ScenarioChart';
import ElectoralInsights from '../components/ElectoralInsights';
import { getTrendData } from '../utils/csvParser';
import { TrendingUp, Users, Award, BarChart3, AlertTriangle, Target } from 'lucide-react';

interface AnalysisPageProps {
  candidates: Candidate[];
}

const AnalysisPage: React.FC<AnalysisPageProps> = ({ candidates }) => {
  const trendData = getTrendData(candidates);
  const topCandidate = candidates.reduce((prev, current) => 
    prev.Intención_Voto_Porcentaje > current.Intención_Voto_Porcentaje ? prev : current
  );
  
  const totalIntention = candidates.reduce((sum, c) => sum + c.Intención_Voto_Porcentaje, 0);
  const undecided = 100 - totalIntention;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
              to="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Volver al inicio</span>
            </Link>
            
            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-900">Panel de Análisis Electoral Completo</h1>
              <p className="text-sm text-gray-500">Colombia 2026 • Datos Ene-Feb 2026 • Atlas Intel • Muestra: 7,298 personas</p>
            </div>
            
            <div className="w-32"></div> {/* Spacer for centering */}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Líder en Intención"
            value={`${topCandidate.Intención_Voto_Porcentaje}%`}
            subtitle={topCandidate.Candidato}
            icon={Award}
            color="bg-purple-500"
            trend={{ value: "Empate técnico", isPositive: false }}
            description="Diferencia de 0.7% con segundo lugar"
          />
          <StatCard
            title="Total Candidatos"
            value={candidates.length.toString()}
            subtitle="Registrados"
            icon={Users}
            color="bg-purple-500"
            description="20 aspirantes en contienda"
          />
          <StatCard
            title="Indecisos"
            value={`${undecided.toFixed(1)}%`}
            subtitle="Del electorado"
            icon={AlertTriangle}
            color="bg-purple-500"
            trend={{ value: "Alta volatilidad", isPositive: false }}
            description="Factor determinante"
          />
          <StatCard
            title="Polarización"
            value="Máxima"
            subtitle="Dos bloques dominantes"
            icon={BarChart3}
            color="bg-purple-500"
            description="Derecha 40% vs Izquierda 34%"
          />
        </div>

        {/* Electoral Insights */}
        <section className="mb-12">
          <ElectoralInsights />
        </section>

        {/* Main Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <VotingIntentionChart candidates={candidates} limit={10} />
          <TrendChart data={trendData} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <FavorabilityChart limit={10} />
          <GenerationChart candidates={candidates} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ComparisonChart />
          <SocialMediaChart />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <RegionalChart />
          <DemographicChart />
        </div>

        {/* Scenario Analysis */}
        <div className="mb-8">
          <ScenarioChart />
        </div>

        {/* Top Candidates Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Candidatos Principales - Top 12
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {candidates
              .sort((a, b) => b.Intención_Voto_Porcentaje - a.Intención_Voto_Porcentaje)
              .slice(0, 12)
              .map((candidate, index) => (
                <CandidateCard
                  key={candidate.Candidato}
                  candidate={candidate}
                  rank={index + 1}
                />
              ))}
          </div>
        </div>

        {/* Complete Table */}
        <CandidateTable candidates={candidates} />

        {/* Comprehensive Analysis */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 mb-8 mt-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Análisis Integral del Panorama Electoral 2026
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Carrera Electoral Reñida</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Abelardo de la Espriella lidera con 32.1% de intención de voto</li>
                <li>• Empate técnico con Iván Cepeda (31.4%), diferencia de apenas 0.7 puntos</li>
                <li>• Fajardo tercero con 7.6%, muy lejos de los dos líderes</li>
                <li>• 20 candidatos en contienda, pero competencia concentrada en dos</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Recomposición Política Drástica</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Derecha: Crecimiento del 28.5% al 40.0% (+11.5 puntos vs 2022)</li>
                <li>• Izquierda: Caída del 40.3% al 34.2% (-6.1 puntos vs 2022)</li>
                <li>• Centro: Reducción del 28.2% al 20.2% (-8.0 puntos vs 2022)</li>
                <li>• Indecisos: Solo 7.7%, electorado más definido que antes</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Dinámicas Emergentes</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Espriella domina 5 de 7 regiones del país</li>
                <li>• Polarización generacional: Cepeda lidera en jóvenes (18-44), Espriella en mayores (45+)</li>
                <li>• Polarización económica: Cepeda en bajos ingresos, Espriella en altos ingresos</li>
                <li>• Rechazo alto para ambos líderes: Cepeda 43.9%, Espriella 33.6%</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Scenarios and Projections */}
        <div className="bg-gradient-to-r from-purple-50 to-purple-50 rounded-xl p-8 border border-purple-200 mb-8">
          <div className="flex items-start space-x-4">
            <div className="bg-purple-600 p-3 rounded-full">
              <Target className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Proyecciones y Escenarios Electorales
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-700">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Escenarios de Segunda Vuelta</h4>
                  <ul className="space-y-2">
                    <li>• <strong>Espriella vs. Cepeda:</strong> Espriella 36.8% vs Cepeda 34.6% (+2.2 puntos)</li>
                    <li>• <strong>Cepeda vs. Pinzón:</strong> Cepeda 35.8% vs Pinzón 18.8% (+17.0 puntos)</li>
                    <li>• <strong>Cepeda vs. Valencia:</strong> Cepeda 35.2% vs Valencia 26.9% (+8.3 puntos)</li>
                    <li>• Alto porcentaje de indecisos en todos los escenarios (28% - 46%)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Factores de Incertidumbre</h4>
                  <ul className="space-y-2">
                    <li>• <strong>Rechazo electoral:</strong> Cepeda 43.9% y Espriella 33.6% de anti-voto</li>
                    <li>• <strong>Evaluación gubernamental:</strong> Impacto del gobierno Petro en la campaña</li>
                    <li>• <strong>Consultas internas:</strong> Gran Consulta (8 marzo) definirá candidato de centro-derecha</li>
                    <li>• <strong>Indecisos en balotaje:</strong> Hasta 46% puede cambiar el resultado final</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Methodology */}
        <div className="bg-gray-100 rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Metodología y Fuentes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Encuestas de Intención</h4>
              <ul className="space-y-1">
                <li>• Muestra: 7,298 personas</li>
                <li>• Período: Ene-Feb 2026</li>
                <li>• Margen de error: ±1.0%</li>
                <li>• Cobertura: Nacional</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Análisis de Rechazo</h4>
              <ul className="space-y-1">
                <li>• Métricas de anti-voto/rechazo</li>
                <li>• Balance de rechazo por candidato</li>
                <li>• Techos electorales por candidato</li>
                <li>• Competitividad en segunda vuelta</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Presencia Digital</h4>
              <ul className="space-y-1">
                <li>• Seguidores en redes sociales</li>
                <li>• Análisis de engagement</li>
                <li>• Crecimiento y tendencias</li>
                <li>• Impacto en intención de voto</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-gray-200 mt-8">
          <p className="text-gray-600 font-medium text-lg">
            Panorama Político Electoral Colombia 2026: Análisis Estadístico Integral
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Basado en encuestas de intención de voto, métricas de favorabilidad y presencia digital
          </p>
          <p className="text-sm text-gray-500">
            Período de campo: Ene-Feb 2026 • Atlas Intel • Muestra: 7,298 personas • Margen de error: ±1.0% • Cobertura nacional
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Fuentes: Encuestas Atlas Intel, WAA, análisis de redes sociales, datos históricos electorales
          </p>
          <p className="text-xs text-purple-500 mt-2">
            Desarrollado por <a href="https://brochure.agapai.com.co" className="hover:text-purple-700">AGAPAI</a>
          </p>
        </footer>
      </main>
    </div>
  );
};

export default AnalysisPage;