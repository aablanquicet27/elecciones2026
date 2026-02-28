import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, BarChart3, ArrowUpRight } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-950 text-white" role="contentinfo">
      <div className="container mx-auto px-6 lg:px-12 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-4 mb-6">
              <img src="/logoagapai.png" alt="Logo Elecciones Colombia 2026" className="h-14 w-14" />
              <span className="text-2xl font-bold tracking-tight">Colombia 2026</span>
            </Link>
            <p className="text-gray-400 text-lg leading-relaxed">
              El análisis más completo y actualizado del panorama electoral 
              presidencial colombiano.
            </p>
          </div>

          {/* Navigation */}
          <nav aria-label="Enlaces de navegación">
            <h3 className="text-lg font-bold mb-6 text-white">Navegación</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors text-lg">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/analisis" className="text-gray-400 hover:text-white transition-colors text-lg">
                  Análisis Completo
                </Link>
              </li>
              <li>
                <Link to="/analisis-tiempo-real" className="text-gray-400 hover:text-white transition-colors text-lg">
                  Análisis en Vivo
                </Link>
              </li>
              <li>
                <a 
                  href="https://wsp.registraduria.gov.co/censo/consultar/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors text-lg inline-flex items-center gap-1"
                >
                  Tu Lugar de Votación
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </li>
            </ul>
          </nav>

          {/* Analysis */}
          <nav aria-label="Enlaces de análisis">
            <h3 className="text-lg font-bold mb-6 text-white">Análisis</h3>
            <ul className="space-y-4">
              <li>
                <span className="text-gray-400 text-lg">Intención de Voto</span>
              </li>
              <li>
                <span className="text-gray-400 text-lg">Favorabilidad</span>
              </li>
              <li>
                <span className="text-gray-400 text-lg">Análisis Regional</span>
              </li>
              <li>
                <span className="text-gray-400 text-lg">Segunda Vuelta</span>
              </li>
            </ul>
          </nav>

          {/* Methodology */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">Metodología</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-gray-400">
                <Calendar className="h-5 w-5 flex-shrink-0" />
                <span className="text-lg">Feb 2026</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <BarChart3 className="h-5 w-5 flex-shrink-0" />
                <span className="text-lg">3,800 encuestados</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <MapPin className="h-5 w-5 flex-shrink-0" />
                <span className="text-lg">Cobertura Nacional</span>
              </div>
              <div className="mt-4 text-gray-400 text-lg">
                Margen de error: ±1.0%
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-16 pt-10">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="text-gray-500 text-center lg:text-left">
              <p className="text-base">
                <strong className="text-gray-400">Panorama Político Electoral Colombia 2026</strong> · Análisis Estadístico Integral
              </p>
              <p className="mt-2 text-sm">
                Datos de Invamer · Metodología rigurosa · Actualización continua
              </p>
            </div>
            
            <div className="text-center lg:text-right">
              <p className="text-gray-500 text-base">
                Desarrollado por{' '}
                <a 
                  href="https://brochure.agapai.com.co" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                >
                  AGAPAI
                </a>
              </p>
              <p className="text-gray-600 text-sm mt-1">
                © 2026 Todos los derechos reservados
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;