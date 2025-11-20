import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Users, Award, ChevronDown, Play } from 'lucide-react';
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
    <div className="relative min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
      </div>

      <div className="relative container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Content */}
          <div className="text-white space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Datos Actualizados • Noviembre 2025</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                Elecciones
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  Colombia
                </span>
                <span className="block">2026</span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-purple-100 leading-relaxed">
                El análisis más completo del panorama electoral presidencial. 
                30 candidatos, encuestas actualizadas y proyecciones estadísticas.
              </p>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">30</div>
                <div className="text-sm text-purple-200">Candidatos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">2,140</div>
                <div className="text-sm text-purple-200">Encuestados</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">±3.0%</div>
                <div className="text-sm text-purple-200">Margen Error</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/analisis"
                className="inline-flex items-center justify-center space-x-2 bg-white text-purple-900 px-8 py-4 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
              >
                <TrendingUp className="h-5 w-5" />
                <span>Ver Análisis Completo</span>
              </Link>
              
              <button className="inline-flex items-center justify-center space-x-2 border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-purple-900 transition-all duration-300 font-semibold">
                <Play className="h-5 w-5" />
                <span>Video Resumen</span>
              </button>
            </div>
          </div>

          {/* Right Content - Candidate Carousel */}
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Líderes Actuales</h3>
                <p className="text-purple-200">Intención de voto • Empate técnico</p>
              </div>

              {/* Candidate Slider */}
              <div className="relative h-96 overflow-hidden rounded-2xl">
                {topThree.map((candidate, index) => (
                  <div
                    key={candidate.Candidato}
                    className={`absolute inset-0 transition-all duration-1000 transform ${
                      index === currentSlide 
                        ? 'translate-x-0 opacity-100' 
                        : index < currentSlide 
                          ? '-translate-x-full opacity-0' 
                          : 'translate-x-full opacity-0'
                    }`}
                  >
                    <div className="bg-white rounded-2xl p-6 h-full flex flex-col items-center justify-center text-center">
                      <img
                        src={getImage(candidate.Candidato)}
                        alt={candidate.Candidato}
                        className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-purple-200"
                      />
                      
                      <h4 className="text-xl font-bold text-gray-900 mb-2">
                        {candidate.Candidato}
                      </h4>
                      
                      <div className="text-3xl font-bold text-purple-600 mb-2">
                        {candidate.Intención_Voto_Porcentaje}%
                      </div>
                      
                      <div className={`px-3 py-1 rounded-full text-sm font-medium mb-4 ${
                        candidate.Tendencia_Política === 'Izquierda' ? 'bg-red-100 text-red-800' :
                        candidate.Tendencia_Política === 'Centro' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {candidate.Tendencia_Política}
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                        <div
                          className="bg-purple-600 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${(candidate.Intención_Voto_Porcentaje / 25) * 100}%` }}
                        ></div>
                      </div>
                      
                      <Link
                        to={`/candidato/${candidate.Candidato.toLowerCase().replace(/\s+/g, '-')}`}
                        className="text-purple-600 hover:text-purple-800 font-medium text-sm"
                      >
                        Ver perfil completo →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Slider Indicators */}
              <div className="flex justify-center space-x-2 mt-4">
                {topThree.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentSlide ? 'bg-white' : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Floating Stats */}
            <div className="absolute -bottom-6 -left-6 bg-purple-400 text-purple-900 px-4 py-2 rounded-xl font-bold shadow-lg">
              <div className="text-sm">Indecisos</div>
              <div className="text-xl">{undecided.toFixed(1)}%</div>
            </div>
            
            <div className="absolute -top-6 -right-6 bg-purple-400 text-purple-900 px-4 py-2 rounded-xl font-bold shadow-lg">
              <div className="text-sm">Margen</div>
              <div className="text-xl">6.5%</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <ChevronDown className="h-8 w-8" />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;