import React from 'react';
import { Vote, TrendingUp, Users, Calendar } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-purple-900 via-purple-800 to-purple-900 text-white shadow-2xl">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white/10 p-3 rounded-full backdrop-blur-sm">
              <Vote className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Panorama Electoral Colombia 2026
              </h1>
              <p className="text-purple-200 text-lg mt-1">
                Análisis Estadístico Integral - Panel Interactivo
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
              <Calendar className="h-5 w-5" />
              <span className="text-sm font-medium">Abril-Junio 2025</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
              <TrendingUp className="h-5 w-5" />
              <span className="text-sm font-medium">Datos Actualizados</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
              <Users className="h-5 w-5" />
              <span className="text-sm font-medium">32 Candidatos</span>
            </div>
          </div>
        </div>
        
        {/* Key Insights Banner */}
        <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">12.6%</div>
              <div className="text-sm text-purple-200">Líder: Gustavo Bolívar</div>
            </div>
            <div>
              <div className="text-2xl font-bold">22.1%</div>
              <div className="text-sm text-purple-200">Indecisos</div>
            </div>
            <div>
              <div className="text-2xl font-bold">±3.2%</div>
              <div className="text-sm text-purple-200">Margen de Error</div>
            </div>
            <div>
              <div className="text-2xl font-bold">3,200</div>
              <div className="text-sm text-purple-200">Muestra</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;