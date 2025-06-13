import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Users, BarChart3, ChevronDown, Play, Award, Target, Calendar, MapPin } from 'lucide-react';
import { Candidate } from '../types/election';
import HeroSection from '../components/HeroSection';
import CandidateGrid from '../components/CandidateGrid';
import StatsOverview from '../components/StatsOverview';
import TrendAnalysis from '../components/TrendAnalysis';
import RegionalMap from '../components/RegionalMap';
import TimelineSection from '../components/TimelineSection';
import ElectoralInsights from '../components/ElectoralInsights';
import NoticiasDelDia from '../components/NoticiasDelDia';
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
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src="/logoagapai.png" alt="Logo" className="h-10 w-10" />
              <span className="text-xl font-bold text-gray-900">Colombia 2026</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => scrollToSection('hero')}
                className={`text-sm font-medium transition-colors ${
                  activeSection === 'hero' ? 'text-purple-600' : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                Inicio
              </button>
              <button 
                onClick={() => scrollToSection('candidates')}
                className={`text-sm font-medium transition-colors ${
                  activeSection === 'candidates' ? 'text-purple-600' : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                Candidatos
              </button>
              <button 
                onClick={() => scrollToSection('noticias')}
                className={`text-sm font-medium transition-colors ${
                  activeSection === 'noticias' ? 'text-purple-600' : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                Noticias
              </button>
              <button 
                onClick={() => scrollToSection('insights')}
                className={`text-sm font-medium transition-colors ${
                  activeSection === 'insights' ? 'text-purple-600' : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                Hallazgos
              </button>
              <button 
                onClick={() => scrollToSection('analysis')}
                className={`text-sm font-medium transition-colors ${
                  activeSection === 'analysis' ? 'text-purple-600' : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                Análisis
              </button>
              <Link 
                to="/analisis"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
              >
                Panel Completo
              </Link>
              <Link 
                to="/analisis-tiempo-real"
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium animate-pulse"
              >
                Análisis en Vivo
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        ref={el => sectionsRef.current['hero'] = el}
        className="pt-20"
      >
        <HeroSection candidates={topCandidates} undecided={undecided} />
      </section>

      {/* Stats Overview */}
      <section className="py-20 bg-white">
        <StatsOverview candidates={candidates} />
      </section>

      {/* Electoral Insights */}
      <section 
        ref={el => sectionsRef.current['insights'] = el}
        className="py-20 bg-gray-50"
      >
        <ElectoralInsights />
      </section>

      {/* Candidates Section */}
      <section 
        ref={el => sectionsRef.current['candidates'] = el}
        className="py-20 bg-white"
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Candidatos Presidenciales 2026
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Conoce a los principales aspirantes a la presidencia de Colombia. 
              Explora sus propuestas, trayectoria y posicionamiento en las encuestas.
            </p>
          </div>
          
          <CandidateGrid candidates={topCandidates} />
          
          <div className="text-center mt-12">
            <Link 
              to="/analisis"
              className="inline-flex items-center space-x-2 bg-purple-600 text-white px-8 py-4 rounded-xl hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <BarChart3 className="h-5 w-5" />
              <span className="font-semibold">Ver Análisis Completo</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Noticias del Día Section */}
      <section 
        ref={el => sectionsRef.current['noticias'] = el}
        className="py-20 bg-gray-50"
      >
        <div className="container mx-auto px-6">
          <NoticiasDelDia />
        </div>
      </section>

      {/* Analysis Section */}
      <section 
        ref={el => sectionsRef.current['analysis'] = el}
        className="py-20 bg-white"
      >
        <TrendAnalysis candidates={candidates} />
      </section>

      {/* Regional Analysis */}
      <section className="py-20 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
        <RegionalMap />
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gray-900">
        <TimelineSection />
      </section>

      {/* Key Insights Summary */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Conclusiones del Análisis Electoral
            </h2>
            <p className="text-xl text-gray-600">
              Los puntos clave que definen el panorama electoral 2026
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl border border-purple-200">
              <div className="bg-purple-600 p-3 rounded-full w-fit mb-4">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Fragmentación Sin Precedentes
              </h3>
              <p className="text-gray-700 mb-4">
                Ningún candidato supera el 15% de intención de voto, evidenciando 
                la mayor fragmentación electoral en la historia reciente.
              </p>
              <div className="text-sm text-purple-600 font-semibold">
                Líder actual: 12.6% (Bolívar)
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl border border-purple-200">
              <div className="bg-purple-600 p-3 rounded-full w-fit mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Reconfiguración Política
              </h3>
              <p className="text-gray-700 mb-4">
                La izquierda cayó del 40.3% al 23%, mientras que los indecisos 
                aumentaron dramáticamente al 21.0%.
              </p>
              <div className="text-sm text-purple-600 font-semibold">
                Cambio: -17.3 puntos (izquierda)
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl border border-purple-200">
              <div className="bg-purple-600 p-3 rounded-full w-fit mb-4">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Centro Como Bisagra
              </h3>
              <p className="text-gray-700 mb-4">
                Los candidatos de centro emergen como los más competitivos 
                para segunda vuelta debido a su menor polarización.
              </p>
              <div className="text-sm text-purple-600 font-semibold">
                Mejor balance: Fajardo (+10 puntos)
              </div>
            </div>
          </div>

          {/* Additional insights */}
          <div className="mt-12 bg-gradient-to-r from-gray-50 to-purple-50 rounded-2xl p-8 border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Factores Determinantes para 2026
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-purple-600 p-3 rounded-full w-fit mx-auto mb-3">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Factor Digital</h4>
                <p className="text-sm text-gray-600">
                  Dávila y López lideran en redes sociales con 3.6M y 3.5M seguidores respectivamente
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-600 p-3 rounded-full w-fit mx-auto mb-3">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Dinámicas Regionales</h4>
                <p className="text-sm text-gray-600">
                  Caribe favorece izquierda (Bolívar 25.9%), Orinoquía prefiere derecha (Dávila 15.7%)
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-600 p-3 rounded-full w-fit mx-auto mb-3">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Polarización Generacional</h4>
                <p className="text-sm text-gray-600">
                  Jóvenes favorecen Bolívar (18.5%), adultos mayores prefieren Dávila (14.2%)
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-600 p-3 rounded-full w-fit mx-auto mb-3">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Competitividad</h4>
                <p className="text-sm text-gray-600">
                  Fajardo y Galán mejor posicionados para segunda vuelta por menor rechazo
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Mantente Informado del Proceso Electoral
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Accede al análisis más completo y actualizado de las elecciones presidenciales Colombia 2026
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/analisis"
              className="inline-flex items-center space-x-2 bg-white text-purple-600 px-8 py-4 rounded-xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
            >
              <BarChart3 className="h-5 w-5" />
              <span>Panel de Análisis Completo</span>
            </Link>
            
            <button className="inline-flex items-center space-x-2 border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-purple-600 transition-all duration-300 font-semibold">
              <Calendar className="h-5 w-5" />
              <span>Calendario Electoral</span>
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;