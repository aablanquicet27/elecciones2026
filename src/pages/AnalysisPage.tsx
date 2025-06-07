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
              <h1 className="text-xl font-bold text-gray-900">Panel de Análisis Electoral</h1>
              <p className="text-sm text-gray-500">Colombia 2026 • Datos Abril-Junio 2025</p>
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

        {/* Main Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <VotingIntentionChart candidates={candidates} limit={10} />
          <TrendChart data={trendData} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <FavorabilityChart candidates={candidates} limit={8} />
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

        {/* Key Insights */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-8 mt-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Hallazgos Principales del Análisis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Liderazgo Fragmentado</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Gustavo Bolívar lidera con 12.6% pero sin mayoría clara</li>
                <li>• Empate técnico entre los tres primeros lugares</li>
                <li>• Alto nivel de indecisión electoral (22.1%)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Reconfiguración Política</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Caída significativa de la izquierda (-20.3 puntos)</li>
                <li>• Crecimiento de la derecha (+3.8 puntos)</li>
                <li>• Aumento dramático de indecisos (+19.1 puntos)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Final Analysis */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-start space-x-4">
            <div className="bg-blue-600 p-2 rounded-full">
              <Target className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Conclusiones del Análisis Electoral 2026
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
                <div>
                  <p className="mb-3">
                    <strong>Fragmentación sin precedentes:</strong> Ningún candidato supera el 15% de intención de voto, 
                    evidenciando la mayor fragmentación electoral en la historia reciente de Colombia.
                  </p>
                  <p className="mb-3">
                    <strong>Debilitamiento del petrismo:</strong> La izquierda experimentó una caída drástica del 40.3% 
                    al 20.0%, mientras que la derecha se fortaleció relativamente.
                  </p>
                </div>
                <div>
                  <p className="mb-3">
                    <strong>Centro como bisagra:</strong> Los candidatos de centro, especialmente Sergio Fajardo, 
                    emergen como los más competitivos para segunda vuelta debido a su menor polarización.
                  </p>
                  <p className="mb-3">
                    <strong>Alta incertidumbre:</strong> Con más del 22% de indecisos, los factores coyunturales 
                    y las campañas electorales tendrán un impacto decisivo en los resultados finales.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-gray-200 mt-8">
          <p className="text-gray-600 font-medium">
            Panorama Político Electoral Colombia 2026: Análisis Estadístico Integral
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Basado en encuestas de intención de voto, métricas de favorabilidad y presencia digital • Abril-Junio 2025
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Muestra: 3,200 personas • Margen de error: ±3.2% • Cobertura nacional
          </p>
        </footer>
      </main>
    </div>
  );
};

export default AnalysisPage;