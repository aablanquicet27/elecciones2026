import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, Users, Award, MapPin, Calendar, ExternalLink } from 'lucide-react';
import { Candidate } from '../types/election';

interface CandidatePageProps {
  candidates: Candidate[];
}

const CandidatePage: React.FC<CandidatePageProps> = ({ candidates }) => {
  const { slug } = useParams<{ slug: string }>();
  
  const candidate = candidates.find(c => 
    c.Candidato.toLowerCase().replace(/\s+/g, '-') === slug
  );

  if (!candidate) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Candidato no encontrado</h1>
          <Link to="/" className="text-blue-600 hover:text-blue-800">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  const getPlaceholderImage = (name: string) => {
    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2);
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=400&background=1e40af&color=ffffff&bold=true`;
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'Izquierda': return 'bg-red-100 text-red-800 border-red-200';
      case 'Centro': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Derecha': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const balance = candidate.Favorabilidad - candidate.Desfavorabilidad;
  const ranking = candidate.Ranking;

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
            
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">Ranking Nacional:</span>
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                #{ranking}
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Candidate Info */}
            <div>
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-white/20 p-2 rounded-full">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <span className="text-blue-200">Candidato Presidencial 2026</span>
              </div>
              
              <h1 className="text-5xl font-bold mb-4">
                {candidate.Candidato}
              </h1>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className={`px-4 py-2 rounded-full border ${getTrendColor(candidate.Tendencia_Política)}`}>
                  {candidate.Tendencia_Política}
                </div>
                <div className="text-blue-200">
                  {candidate.Edad} años • {candidate.Generación}
                </div>
              </div>
              
              <p className="text-xl text-blue-100 mb-8">
                {candidate.Cargo_Actual}
              </p>
              
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">
                    {candidate.Intención_Voto_Porcentaje}%
                  </div>
                  <div className="text-sm text-blue-200">Intención de Voto</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">
                    {candidate.Favorabilidad}%
                  </div>
                  <div className="text-sm text-blue-200">Favorabilidad</div>
                </div>
                <div className="text-center">
                  <div className={`text-3xl font-bold ${balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {balance > 0 ? '+' : ''}{balance}
                  </div>
                  <div className="text-sm text-blue-200">Balance Neto</div>
                </div>
              </div>
            </div>

            {/* Candidate Photo */}
            <div className="text-center">
              <div className="relative inline-block">
                <img
                  src={getPlaceholderImage(candidate.Candidato)}
                  alt={candidate.Candidato}
                  className="w-80 h-80 rounded-full object-cover border-8 border-white/20 shadow-2xl"
                />
                <div className="absolute -top-4 -right-4 bg-yellow-500 text-yellow-900 px-4 py-2 rounded-xl font-bold shadow-lg">
                  #{ranking}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Analysis */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Stats */}
            <div className="lg:col-span-2 space-y-8">
              {/* Electoral Performance */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Rendimiento Electoral
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Intención de Voto
                    </h3>
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {candidate.Intención_Voto_Porcentaje}%
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                      <div
                        className="bg-blue-600 h-4 rounded-full transition-all duration-1000"
                        style={{ width: `${(candidate.Intención_Voto_Porcentaje / 15) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Posición #{ranking} en el ranking nacional de candidatos
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Favorabilidad vs Desfavorabilidad
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Favorabilidad</span>
                        <span className="text-lg font-bold text-green-600">
                          {candidate.Favorabilidad}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${candidate.Favorabilidad}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Desfavorabilidad</span>
                        <span className="text-lg font-bold text-red-600">
                          {candidate.Desfavorabilidad}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-500 h-2 rounded-full"
                          style={{ width: `${candidate.Desfavorabilidad}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Political Profile */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Perfil Político
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm text-gray-600">Tendencia Política</span>
                      <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium border mt-1 ${getTrendColor(candidate.Tendencia_Política)}`}>
                        {candidate.Tendencia_Política}
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-sm text-gray-600">Partido/Movimiento</span>
                      <div className="font-semibold text-gray-900">
                        {candidate.Partido_Movimiento}
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-sm text-gray-600">Tipo de Candidatura</span>
                      <div className="font-semibold text-gray-900">
                        {candidate.Tipo_Candidatura}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm text-gray-600">Región de Origen</span>
                      <div className="font-semibold text-gray-900">
                        {candidate.Región_Origen}
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-sm text-gray-600">Cargo Actual</span>
                      <div className="font-semibold text-gray-900">
                        {candidate.Cargo_Actual}
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-sm text-gray-600">Generación</span>
                      <div className="font-semibold text-gray-900">
                        {candidate.Generación}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Estadísticas Rápidas
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Ranking Nacional</span>
                    <span className="font-bold text-blue-600">#{ranking}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Balance Neto</span>
                    <span className={`font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {balance > 0 ? '+' : ''}{balance}%
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Edad</span>
                    <span className="font-bold text-gray-900">{candidate.Edad} años</span>
                  </div>
                </div>
              </div>

              {/* Competitive Analysis */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Análisis Competitivo
                </h3>
                
                <div className="space-y-3 text-sm">
                  {ranking <= 3 && (
                    <div className="flex items-center space-x-2 text-green-700">
                      <Award className="h-4 w-4" />
                      <span>Top 3 nacional</span>
                    </div>
                  )}
                  
                  {balance > 0 && (
                    <div className="flex items-center space-x-2 text-green-700">
                      <TrendingUp className="h-4 w-4" />
                      <span>Balance positivo de favorabilidad</span>
                    </div>
                  )}
                  
                  {candidate.Intención_Voto_Porcentaje > 10 && (
                    <div className="flex items-center space-x-2 text-blue-700">
                      <Users className="h-4 w-4" />
                      <span>Candidato con opciones reales</span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2 text-gray-700">
                    <MapPin className="h-4 w-4" />
                    <span>Origen: {candidate.Región_Origen}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Más Información
                </h3>
                
                <div className="space-y-3">
                  <Link
                    to="/analisis"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>Ver Análisis Completo</span>
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                  
                  <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Cronograma Electoral</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CandidatePage;