import React from 'react';
import { MapPin, ExternalLink, Calendar, BarChart3 } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img src="/logoagapai.png" alt="Logo" className="h-8 w-8" />
              <span className="text-xl font-bold">Colombia 2026</span>
            </div>
            <p className="text-gray-400 text-sm">
              El análisis más completo y actualizado del panorama electoral 
              presidencial colombiano. Datos, estadísticas y proyecciones 
              en tiempo real.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <ExternalLink className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <BarChart3 className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Calendar className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Navegación</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Inicio
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Candidatos
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Análisis Completo
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Encuestas
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Cronograma Electoral
                </a>
              </li>
            </ul>
          </div>

          {/* Analysis */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Análisis</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Intención de Voto
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Favorabilidad
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Análisis Regional
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Tendencias Políticas
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Escenarios Segunda Vuelta
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Información</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2 text-gray-400">
                <Calendar className="h-4 w-4" />
                <span>Actualizado: Junio 2025</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <BarChart3 className="h-4 w-4" />
                <span>Muestra: 3,200 personas</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <MapPin className="h-4 w-4" />
                <span>Cobertura: Nacional</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-400 mb-4 md:mb-0">
              <p>
                <strong>Panorama Político Electoral Colombia 2026:</strong> Análisis Estadístico Integral
              </p>
              <p className="mt-1">
                Basado en encuestas de intención de voto, métricas de favorabilidad y presencia digital • Abril-Junio 2025
              </p>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-800 text-center">
            <p className="text-xs text-gray-500">
              <strong>Metodología:</strong> Muestra de 3,200 personas • Margen de error: ±3.2% • Cobertura nacional • 
              Período de campo: Abril-Junio 2025 • Análisis estadístico integral
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Desarrollado por <a href="https://brochure.agapai.com.co" className="text-purple-400 hover:text-purple-300">AGAPAI</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;