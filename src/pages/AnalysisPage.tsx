import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Candidate } from '../types/election';
import Header from '../components/Header';
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
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Volver al inicio</span>
            </Link>
            
            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-900">Panel de Análisis Electoral Completo</h1>
              <p className="text-sm text-gray-500">Colombia 2026 • Datos Abril-Junio 2025 • Muestra: 3,200 personas</p>
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
            color="bg-blue-500"
            trend={{ value: "Empate técnico", isPositive: false }}
            description="Diferencia de 1.2% con segundo lugar"
          />
          <StatCard
            title="Total Candidatos"
            value={candidates.length.toString()}
            subtitle="Registrados"
            icon={Users}
            color="bg-green-500"
            description="32 aspirantes confirmados"
          />
          <StatCard
            title="Indecisos"
            value={`${undecided.toFixed(1)}%`}
            subtitle="Del electorado"
            icon={AlertTriangle}
            color="bg-orange-500"
            trend={{ value: "Alta volatilidad", isPositive: false }}
            description="Factor determinante"
          />
          <StatCard
            title="Fragmentación"
            value="Máxima"
            subtitle="Sin mayoría clara"
            icon={BarChart3}
            color="bg-red-500"
            description="Ningún candidato >15%"
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
              <h4 className="font-semibold text-gray-800 mb-3">Fragmentación Sin Precedentes</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Gustavo Bolívar lidera con apenas 12.6% de intención de voto</li>
                <li>• Empate técnico entre los tres primeros lugares (diferencia de 1.2%)</li>
                <li>• Ningún candidato supera el 15%, evidenciando máxima dispersión</li>
                <li>• 32 candidatos registrados, la mayor oferta electoral histórica</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Recomposición Política Drástica</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Izquierda: Caída del 40.3% al 23.0% (-17.3 puntos)</li>
                <li>• Indecisos: Aumento del 3.0% al 21.0% (+18.0 puntos)</li>
                <li>• Derecha: Crecimiento moderado del 28.5% al 29.0% (+0.5 puntos)</li>
                <li>• Centro: Estabilidad relativa del 28.2% al 27.0% (-1.2 puntos)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Dinámicas Emergentes</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Factor digital determinante: Dávila y López lideran redes</li>
                <li>• Polarización generacional: Jóvenes vs adultos mayores</li>
                <li>• Diferenciación regional: Caribe progresista, Orinoquía conservadora</li>
                <li>• Candidatos de centro mejor posicionados para segunda vuelta</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Scenarios and Projections */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-200 mb-8">
          <div className="flex items-start space-x-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Target className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Proyecciones y Escenarios Electorales
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-700">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Escenarios Más Probables</h4>
                  <ul className="space-y-2">
                    <li>• <strong>Bolívar vs. Dávila (25% probabilidad):</strong> Dávila 46.8% vs Bolívar 43.5%</li>
                    <li>• <strong>Bolívar vs. Fajardo (20% probabilidad):</strong> Fajardo 48.5% vs Bolívar 41.2%</li>
                    <li>• <strong>Fajardo vs. Dávila (18% probabilidad):</strong> Fajardo 38.6% vs Dávila 35.2%</li>
                    <li>• Alta indecisión en todos los escenarios (9.7% - 30.0%)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Factores de Incertidumbre</h4>
                  <ul className="space-y-2">
                    <li>• <strong>Volatilidad electoral:</strong> 21% de indecisos puede cambiar resultado</li>
                    <li>• <strong>Evaluación gubernamental:</strong> Impacto del gobierno Petro (34% aprobación)</li>
                    <li>• <strong>Coaliciones políticas:</strong> Capacidad de unificación por bloques</li>
                    <li>• <strong>Coyuntura económica:</strong> Situación económica al momento electoral</li>
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
                <li>• Muestra: 3,200 personas</li>
                <li>• Período: Abril-Junio 2025</li>
                <li>• Margen de error: ±3.2%</li>
                <li>• Cobertura: Nacional</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Análisis de Favorabilidad</h4>
              <ul className="space-y-1">
                <li>• Métricas de aceptación/rechazo</li>
                <li>• Balance neto de favorabilidad</li>
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
            Período de campo: Abril-Junio 2025 • Muestra: 3,200 personas • Margen de error: ±3.2% • Cobertura nacional
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Fuentes: Encuestas Guarumo/EcoAnalítica, análisis de redes sociales, datos históricos electorales
          </p>
        </footer>
      </main>
    </div>
  );
};

export default AnalysisPage;