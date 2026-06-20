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
  const blanco = Math.max(0, 100 - totalIntention);

  return (
    <div className="min-h-screen bg-gray-50">
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
              <p className="text-sm text-gray-500">Colombia 2026 • Segunda vuelta 21 jun • Resultado 1ª vuelta + encuestas de junio</p>
            </div>

            <div className="w-32"></div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Ganó 1ª vuelta"
            value={`${topCandidate.Intención_Voto_Porcentaje}%`}
            subtitle={topCandidate.Candidato}
            icon={Award}
            color="bg-purple-500"
            trend={{ value: "+2,84 pts sobre Cepeda", isPositive: true }}
            description="Resultado oficial del 31 de mayo"
          />
          <StatCard
            title="Favorito 2ª vuelta"
            value="~51%"
            subtitle="De la Espriella"
            icon={TrendingUp}
            color="bg-purple-500"
            trend={{ value: "Polymarket 89%", isPositive: true }}
            description="Promedio encuestas de junio"
          />
          <StatCard
            title="Voto en blanco"
            value={`${blanco.toFixed(1)}%`}
            subtitle="1ª vuelta"
            icon={AlertTriangle}
            color="bg-purple-500"
            description="406.970 votos"
          />
          <StatCard
            title="Polarización"
            value="Máxima"
            subtitle="Derecha vs Izquierda"
            icon={BarChart3}
            color="bg-purple-500"
            description="Espriella 43,75% vs Cepeda 40,9%"
          />
        </div>

        <section className="mb-12">
          <ElectoralInsights />
        </section>

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

        <div className="mb-8">
          <ScenarioChart />
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Resultado por candidato - Primera vuelta
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

        <CandidateTable candidates={candidates} />

        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 mb-8 mt-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Análisis Integral del Balotaje 2026
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Resultado de la primera vuelta</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Abelardo de la Espriella ganó con 43,75% (10,36M votos)</li>
                <li>• Iván Cepeda quedó segundo con 40,9% (9,69M votos)</li>
                <li>• Paloma Valencia tercera con 6,9%; Fajardo cuarto con 4,3%</li>
                <li>• Nadie alcanzó el 50%+1: segunda vuelta el 21 de junio</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Giro a la derecha</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• La derecha pasó de 28,5% (2022) a ~44% en primera vuelta</li>
                <li>• El centro se desplomó (Fajardo + López por debajo del 6%)</li>
                <li>• La izquierda se mantuvo firme alrededor del 41%</li>
                <li>• Participación del 57,9%, la más alta desde 1998</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Dinámicas del balotaje</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• De la Espriella favorito en todas las encuestas de junio</li>
                <li>• Cepeda fuerte en Caribe, Pacífico, Bogotá y entre jóvenes</li>
                <li>• De la Espriella domina Antioquia, Eje Cafetero y mayores de 45</li>
                <li>• La transferencia del voto de Valencia es decisiva</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-50 rounded-xl p-8 border border-purple-200 mb-8">
          <div className="flex items-start space-x-4">
            <div className="bg-purple-600 p-3 rounded-full">
              <Target className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Proyecciones de la Segunda Vuelta
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-700">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Encuestas de balotaje (junio)</h4>
                  <ul className="space-y-2">
                    <li>• <strong>AtlasIntel/Semana:</strong> De la Espriella 52,2% vs Cepeda 44,5% (+7,7)</li>
                    <li>• <strong>Guarumo/EcoAnalítica:</strong> De la Espriella 52,6% vs Cepeda 45% (+7,6)</li>
                    <li>• <strong>CNC:</strong> De la Espriella 48,6% vs Cepeda 44,7% (+3,9)</li>
                    <li>• Promedio: De la Espriella ~51% vs Cepeda ~45%</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Factores de incertidumbre</h4>
                  <ul className="space-y-2">
                    <li>• <strong>Mercados:</strong> Polymarket da ~89% a De la Espriella</li>
                    <li>• <strong>Transferencia:</strong> hacia dónde va el voto de Valencia y Fajardo</li>
                    <li>• <strong>Participación:</strong> capacidad de cada orilla de movilizar</li>
                    <li>• <strong>Endosos:</strong> respaldo de Trump a De la Espriella; Petro tras Cepeda</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-100 rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Metodología y Fuentes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Resultado 1ª vuelta</h4>
              <ul className="space-y-1">
                <li>• Fuente: Registraduría Nacional</li>
                <li>• Fecha: 31 de mayo de 2026</li>
                <li>• Participación: 57,9%</li>
                <li>• 23,98M votos</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Encuestas de balotaje</h4>
              <ul className="space-y-1">
                <li>• CNC, Guarumo, AtlasIntel</li>
                <li>• Período: junio 2026</li>
                <li>• Margen: ±2% a ±3%</li>
                <li>• Cobertura: nacional</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Mercados de predicción</h4>
              <ul className="space-y-1">
                <li>• Polymarket</li>
                <li>• De la Espriella ~89%</li>
                <li>• Volumen: US$38M+</li>
                <li>• Actualizado: 19 jun 2026</li>
              </ul>
            </div>
          </div>
        </div>

        <footer className="text-center py-8 border-t border-gray-200 mt-8">
          <p className="text-gray-600 font-medium text-lg">
            Segunda vuelta presidencial Colombia 2026: análisis estadístico integral
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Resultado oficial de la primera vuelta, encuestas de balotaje y mercados de predicción
          </p>
          <p className="text-sm text-gray-500">
            Registraduría Nacional (31 may) • CNC • Guarumo • AtlasIntel (junio) • Polymarket
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
