import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Users, BarChart3, ArrowRight, Award, Target, Calendar, MapPin } from 'lucide-react';
import { Candidate } from '../types/election';
import HeroSection from '../components/HeroSection';
import CandidateGrid from '../components/CandidateGrid';
import StatsOverview from '../components/StatsOverview';
import PollAverageTable from '../components/PollAverageTable';
import TrendAnalysis from '../components/TrendAnalysis';
import RegionalMap from '../components/RegionalMap';
import TimelineSection from '../components/TimelineSection';
import ElectoralInsights from '../components/ElectoralInsights';
import NoticiasPreview from '../components/NoticiasPreview';
import Footer from '../components/Footer';

interface HomePageProps {
  candidates: Candidate[];
}

const HomePage: React.FC<HomePageProps> = ({ candidates }) => {
  const [activeSection, setActiveSection] = useState('hero');
  const sectionsRef = useRef<{ [key: string]: HTMLElement | null }>({});

  const scrollToSection = (sectionId: string) => {
    const element = sectionsRef.current[sectionId];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  const topCandidates = candidates
    .sort((a, b) => b.Intención_Voto_Porcentaje - a.Intención_Voto_Porcentaje)
    .slice(0, 12);

  const totalIntention = candidates.reduce((sum, c) => sum + c.Intención_Voto_Porcentaje, 0);
  const undecided = 100 - totalIntention;

  return (
    <main className="min-h-screen bg-white">
      {/* Premium Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 nav-premium" role="navigation" aria-label="Navegación principal">
        <div className="container mx-auto px-6 lg:px-12 py-5">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-4 group" aria-label="Ir al inicio">
              <img src="/logoagapai.png" alt="Logo Elecciones Colombia 2026" className="h-12 w-12" />
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-gray-900 tracking-tight leading-tight">Colombia 2026</span>
                <span className="text-sm text-gray-500 leading-tight">Elecciones Presidenciales</span>
              </div>
            </Link>
            
            <div className="hidden lg:flex items-center space-x-10">
              <button 
                onClick={() => scrollToSection('hero')}
                className={`text-base font-medium transition-colors ${
                  activeSection === 'hero' ? 'text-purple-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Inicio
              </button>
              <button 
                onClick={() => scrollToSection('candidates')}
                className={`text-base font-medium transition-colors ${
                  activeSection === 'candidates' ? 'text-purple-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Candidatos
              </button>
              <button 
                onClick={() => scrollToSection('noticias')}
                className={`text-base font-medium transition-colors ${
                  activeSection === 'noticias' ? 'text-purple-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Noticias
              </button>
              <button 
                onClick={() => scrollToSection('insights')}
                className={`text-base font-medium transition-colors ${
                  activeSection === 'insights' ? 'text-purple-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Hallazgos
              </button>
              <button 
                onClick={() => scrollToSection('analysis')}
                className={`text-base font-medium transition-colors ${
                  activeSection === 'analysis' ? 'text-purple-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Análisis
              </button>
              <Link
                to="/senado"
                className="bg-white border-2 border-purple-600 text-purple-600 px-6 py-3 rounded-xl hover:bg-purple-50 transition-all text-base font-semibold"
              >
                Elecciones al Senado →
              </Link>
              <Link
                to="/analisis"
                className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-all text-base font-semibold shadow-lg shadow-purple-500/20"
              >
                Panel Completo
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        ref={(el) => { sectionsRef.current['hero'] = el; }}
        id="hero"
      >
        <HeroSection candidates={topCandidates} undecided={undecided} />
      </section>

      {/* Stats Overview */}
      <section className="section-premium bg-white" aria-label="Estadísticas electorales">
        <StatsOverview candidates={candidates} />
      </section>

      {/* Promedio de Encuestas */}
      <section className="container mx-auto px-6 lg:px-12" aria-label="Promedio de encuestas">
        <PollAverageTable />
      </section>

      {/* Electoral Insights */}
      <section 
        ref={(el) => { sectionsRef.current['insights'] = el; }}
        id="insights"
        className="section-premium bg-purple-pastel"
        aria-label="Hallazgos electorales"
      >
        <ElectoralInsights />
      </section>

      {/* Candidates Section */}
      <section 
        ref={(el) => { sectionsRef.current['candidates'] = el; }}
        id="candidates"
        className="section-premium bg-gradient-to-b from-white via-purple-50/30 to-white"
        aria-label="Candidatos presidenciales"
      >
        <div className="container mx-auto px-6 lg:px-12">
          <header className="text-center mb-20">
            <h2 className="text-gray-900 mb-6">
              Candidatos Presidenciales
            </h2>
            <p className="text-large max-w-3xl mx-auto">
              Conoce a los principales aspirantes a la presidencia de Colombia. 
              Explora sus propuestas, trayectoria y posicionamiento en las encuestas.
            </p>
          </header>
          
          <CandidateGrid candidates={topCandidates} />
          
          <div className="text-center mt-16">
            <Link 
              to="/analisis"
              className="btn-primary inline-flex items-center space-x-3"
              aria-label="Ver análisis electoral completo"
            >
              <BarChart3 className="h-5 w-5" />
              <span>Ver Análisis Completo</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Noticias del Día Section */}
      <section 
        ref={(el) => { sectionsRef.current['noticias'] = el; }}
        id="noticias"
        className="section-premium bg-purple-pastel"
        aria-label="Noticias del día"
      >
        <div className="container mx-auto px-6 lg:px-12">
          <NoticiasPreview />
        </div>
      </section>

      {/* Analysis Section */}
      <section 
        ref={(el) => { sectionsRef.current['analysis'] = el; }}
        id="analysis"
        className="section-premium bg-gradient-to-b from-white to-purple-50/50"
        aria-label="Análisis de tendencias"
      >
        <TrendAnalysis candidates={candidates} />
      </section>

      {/* Regional Analysis */}
      <section className="section-premium bg-gray-900" aria-label="Análisis regional">
        <RegionalMap />
      </section>

      {/* Timeline */}
      <section className="section-premium bg-gray-950" aria-label="Cronograma electoral">
        <TimelineSection />
      </section>

      {/* Key Insights Summary */}
      <section className="section-premium bg-purple-pastel" aria-label="Conclusiones del análisis">
        <div className="container mx-auto px-6 lg:px-12">
          <header className="text-center mb-20">
            <h2 className="text-gray-900 mb-6">
              Conclusiones del Análisis Electoral
            </h2>
            <p className="text-large">
              Los puntos clave que definen el panorama electoral 2026
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <article className="card-premium p-10">
              <div className="bg-purple-100 p-4 rounded-2xl w-fit mb-6">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-gray-900 mb-4">
                Liderazgo Claro
              </h3>
              <p className="text-gray-600 text-lg mb-6">
                Cepeda se consolida en el primer lugar con una ventaja significativa,
                dejando atrás el empate técnico de encuestas anteriores.
              </p>
              <div className="text-purple-600 font-semibold text-lg">
                Cepeda 37.1% vs Espriella 18.9%
              </div>
            </article>

            <article className="card-premium p-10">
              <div className="bg-purple-100 p-4 rounded-2xl w-fit mb-6">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-gray-900 mb-4">
                Centro y Derecha Reagrupándose
              </h3>
              <p className="text-gray-600 text-lg mb-6">
                De la Espriella se mantiene segundo con 18.9%, mientras Claudia López
                (11.7%) y Paloma Valencia (10.0%) toman fuerza.
              </p>
              <div className="text-purple-600 font-semibold text-lg">
                López sube al 3er lugar
              </div>
            </article>

            <article className="card-premium p-10">
              <div className="bg-purple-100 p-4 rounded-2xl w-fit mb-6">
                <Target className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-gray-900 mb-4">
                Proyección Segunda Vuelta
              </h3>
              <p className="text-gray-600 text-lg mb-6">
                En un eventual balotaje, Cepeda vencería a De la Espriella 59.4% vs 37.4%,
                marcando una tendencia clara para la izquierda.
              </p>
              <div className="text-purple-600 font-semibold text-lg">
                Ventaja segunda vuelta: +22.0 puntos
              </div>
            </article>
          </div>

          {/* Additional insights */}
          <div className="mt-20 bg-gray-50 rounded-[2rem] p-12 border border-gray-100">
            <h3 className="text-3xl font-bold text-gray-900 mb-10 text-center">
              Factores Determinantes para 2026
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              <div className="text-center">
                <div className="bg-purple-100 p-4 rounded-2xl w-fit mx-auto mb-4">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <h4 className="font-bold text-xl text-gray-900 mb-3">Rechazo Electoral</h4>
                <p className="text-gray-600">
                  Cepeda lidera rechazo con 43.9%, Espriella 33.6%. Ambos rechazados por 22.5%
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 p-4 rounded-2xl w-fit mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-purple-600" />
                </div>
                <h4 className="font-bold text-xl text-gray-900 mb-3">Dinámicas Regionales</h4>
                <p className="text-gray-600">
                  Espriella domina 5 de 7 regiones. Cepeda lidera en Caribe y Pacífica
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 p-4 rounded-2xl w-fit mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-purple-600" />
                </div>
                <h4 className="font-bold text-xl text-gray-900 mb-3">Consultas Internas</h4>
                <p className="text-gray-600">
                  Frente por la Vida: Cepeda 92.3%. Gran Consulta: Valencia 19.1%, Pinzón 13.1%
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 p-4 rounded-2xl w-fit mx-auto mb-4">
                  <Award className="h-8 w-8 text-purple-600" />
                </div>
                <h4 className="font-bold text-xl text-gray-900 mb-3">Reconfiguración del Centro</h4>
                <p className="text-gray-600">
                  Claudia López sube al 11.7%, mientras Fajardo cae al 6.6%. El centro busca consolidar un liderazgo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-32 bg-gray-900" aria-label="Llamada a la acción">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-white mb-8">
            Mantente Informado
          </h2>
          <p className="text-2xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Accede al análisis más completo y actualizado de las elecciones presidenciales Colombia 2026
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              to="/analisis"
              className="btn-primary inline-flex items-center space-x-3"
            >
              <BarChart3 className="h-5 w-5" />
              <span>Panel de Análisis Completo</span>
            </Link>
            
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default HomePage;