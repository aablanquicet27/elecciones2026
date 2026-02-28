import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Candidate } from '../types/election';
import { getCandidateImage } from '../utils/candidateImages';

interface HeroSectionProps {
  candidates: Candidate[];
  undecided: number;
}

const HeroSection: React.FC<HeroSectionProps> = ({ candidates, undecided }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const topThree = candidates.slice(0, 3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % topThree.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [topThree.length]);

  const getImage = (name: string) => getCandidateImage(name, 400);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-purple-100 via-purple-50 to-white overflow-hidden" aria-label="Panorama electoral Colombia 2026">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

      <div className="relative container mx-auto px-6 lg:px-12 pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center min-h-[85vh]">
          {/* Left Content */}
          <div className="space-y-10">
            {/* Badge */}
            <div className="inline-flex items-center space-x-3 bg-purple-50 px-5 py-2.5 rounded-full border border-purple-100">
              <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
              <span className="text-base font-medium text-purple-700">Datos Actualizados · Encuesta Invamer · Feb 2026</span>
            </div>
            
            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="headline-hero text-gray-900">
                Elecciones
                <span className="block text-purple-600">Colombia</span>
                <span className="block">2026</span>
              </h1>
              
              <p className="text-large max-w-xl">
                El análisis más completo del panorama electoral presidencial. 
                Liderazgo de Iván Cepeda seguido por Abelardo de la Espriella.
              </p>
            </div>

            {/* Key Stats - Minimal */}
            <div className="flex flex-wrap gap-8 md:gap-12 pt-4">
              <div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">37.1%</div>
                <div className="text-sm text-gray-500 mt-1">Cepeda</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">18.9%</div>
                <div className="text-sm text-gray-500 mt-1">De la Espriella</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-purple-600 tracking-tight">{undecided.toFixed(0)}%</div>
                <div className="text-sm text-gray-500 mt-1">Indecisos</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 pt-6">
              <Link 
                to="/analisis"
                className="btn-primary inline-flex items-center justify-center space-x-3"
                aria-label="Ver análisis electoral completo"
              >
                <span>Ver Análisis Completo</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              
              <Link 
                to="/senado"
                className="btn-secondary bg-purple-100/50 border-purple-200 text-purple-900 inline-flex items-center justify-center space-x-3 hover:bg-purple-600"
                aria-label="Ver elecciones al Senado"
              >
                <span>Elecciones al Senado</span>
                <ArrowRight className="h-5 w-5" />
              </Link>

              <a 
                href="https://wsp.registraduria.gov.co/censo/consultar/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary inline-flex items-center justify-center space-x-3"
                aria-label="Consultar lugar de votación"
              >
                <span>Tu Lugar de Votación</span>
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Right Content - Top Candidates */}
          <div className="relative">
            <div className="bg-white/80 backdrop-blur-sm rounded-[2rem] p-8 lg:p-10 border border-purple-100 shadow-xl shadow-purple-500/10">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Líderes Actuales</h2>
                <p className="text-gray-500">Intención de voto · Primera vuelta</p>
              </div>

              {/* Candidate Cards */}
              <div className="space-y-4">
                {topThree.map((candidate, index) => (
                  <Link
                    key={candidate.Candidato}
                    to={`/candidato/${candidate.Candidato.toLowerCase().replace(/\s+/g, '-')}`}
                    className={`block bg-white rounded-2xl p-6 border border-gray-100 transition-all duration-300 hover:shadow-lg hover:border-purple-200 ${
                      index === currentSlide ? 'ring-2 ring-purple-500 ring-offset-2' : ''
                    }`}
                    aria-label={`Ver perfil de ${candidate.Candidato}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-5">
                        <div className="relative">
                          <span className="absolute -top-1 -left-1 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </span>
                          <img
                            src={getImage(candidate.Candidato)}
                            alt={`Foto de ${candidate.Candidato}`}
                            className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
                            loading="lazy"
                          />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{candidate.Candidato}</h3>
                          <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${
                            candidate.Tendencia_Política === 'Izquierda' ? 'bg-red-50 text-red-700' :
                            candidate.Tendencia_Política === 'Centro' ? 'bg-blue-50 text-blue-700' :
                            'bg-green-50 text-green-700'
                          }`}>
                            {candidate.Tendencia_Política}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="percentage-large">{candidate.Intención_Voto_Porcentaje}%</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Methodology note */}
              <p className="text-center text-sm text-gray-400 mt-6">
                Datos Invamer · Margen de error: ±1.5%
              </p>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-gray-400 animate-bounce">
          <ChevronDown className="h-8 w-8" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;