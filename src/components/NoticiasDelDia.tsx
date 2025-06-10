import React, { useState, useEffect } from 'react';
import { 
  Newspaper, 
  Clock, 
  ExternalLink, 
  RefreshCw, 
  AlertCircle, 
  Users, 
  Building, 
  Calendar,
  Eye,
  TrendingUp,
  Star
} from 'lucide-react';
import { obtenerNoticiasProcesadas } from '../utils/newsApi';

// Actualizar interfaz para coincidir con los datos reales
interface Noticia {
  title: string;
  content: string;
  date: string;
  source: string;
  candidates: string[];
  political_parties: string[];
}

const NoticiasDelDia: React.FC = () => {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ultimaActualizacion, setUltimaActualizacion] = useState<Date | null>(null);
  const [noticiaExpandida, setNoticiaExpandida] = useState<number | null>(null);

  const cargarNoticias = async () => {
    setCargando(true);
    setError(null);
    
    const resultado = await obtenerNoticiasProcesadas();
    
    if (resultado.exito) {
      setNoticias(resultado.datos);
      setUltimaActualizacion(new Date());
      console.log('Noticias cargadas:', resultado.datos); // Para debugging
    } else {
      setError(resultado.error);
    }
    
    setCargando(false);
  };

  useEffect(() => {
    cargarNoticias();
  }, []);

  const formatearFecha = (fechaString: string) => {
    if (!fechaString) return 'Fecha no disponible';
    
    try {
      const fecha = new Date(fechaString);
      return fecha.toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return 'Fecha no válida';
    }
  };

  const truncarTexto = (texto: string, limite: number = 200) => {
    if (!texto) return 'Sin contenido disponible';
    if (texto.length <= limite) return texto;
    return texto.substring(0, limite) + '...';
  };

  const toggleExpansion = (index: number) => {
    setNoticiaExpandida(noticiaExpandida === index ? null : index);
  };

  const obtenerColorPartido = (partido: string) => {
    const colores: { [key: string]: string } = {
      'Centro Democrático': 'bg-blue-100 text-blue-800',
      'Liberal': 'bg-red-100 text-red-800',
      'Conservador': 'bg-green-100 text-green-800',
      'Cambio Radical': 'bg-orange-100 text-orange-800',
      'Alianza Verde': 'bg-emerald-100 text-emerald-800',
      'Polo Democrático': 'bg-yellow-100 text-yellow-800',
      'Pacto Histórico': 'bg-purple-100 text-purple-800',
    };
    return colores[partido] || 'bg-gray-100 text-gray-800';
  };

  const obtenerColorCandidato = (index: number) => {
    const colores = [
      'bg-indigo-100 text-indigo-800',
      'bg-pink-100 text-pink-800',
      'bg-cyan-100 text-cyan-800',
      'bg-lime-100 text-lime-800',
      'bg-amber-100 text-amber-800',
      'bg-violet-100 text-violet-800',
    ];
    return colores[index % colores.length];
  };

  if (cargando) {
    return (
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <div className="flex items-center justify-center space-x-3 mb-8">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-purple-600"></div>
          <h2 className="text-3xl font-bold text-gray-900">Cargando Noticias Electorales</h2>
        </div>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-gray-50 rounded-2xl p-6">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="flex space-x-2 mb-3">
                <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                <div className="h-6 bg-gray-200 rounded-full w-24"></div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <div className="text-center">
          <div className="bg-red-100 p-6 rounded-full w-fit mx-auto mb-6">
            <AlertCircle className="h-12 w-12 text-red-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Error al Cargar Noticias</h2>
          <p className="text-gray-600 mb-8 text-lg">{error}</p>
          <button
            onClick={cargarNoticias}
            className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg"
          >
            <RefreshCw className="h-5 w-5" />
            <span className="font-semibold">Intentar de Nuevo</span>
          </button>
        </div>
      </div>
    );
  }

  // Estadísticas generales
  const totalCandidatos = [...new Set(noticias.flatMap(n => n.candidates || []))].length;
  const totalPartidos = [...new Set(noticias.flatMap(n => n.political_parties || []))].length;
  const fuentesUnicas = [...new Set(noticias.map(n => n.source))].length;

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
      {/* Header Mejorado */}
      <div className="bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <Newspaper className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Noticias Electorales 2026</h1>
              <p className="text-purple-100 text-lg">Últimas noticias y desarrollos políticos</p>
            </div>
          </div>
          
          <button
            onClick={cargarNoticias}
            disabled={cargando}
            className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-xl transition-all duration-300 disabled:opacity-50 backdrop-blur-sm"
            title="Actualizar noticias"
          >
            <RefreshCw className={`h-6 w-6 ${cargando ? 'animate-spin' : ''}`} />
          </button>
        </div>
        
        {/* Estadísticas */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <Newspaper className="h-5 w-5 text-white/80" />
              <div>
                <p className="text-white/80 text-sm">Noticias</p>
                <p className="text-white text-xl font-bold">{noticias.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <Users className="h-5 w-5 text-white/80" />
              <div>
                <p className="text-white/80 text-sm">Candidatos</p>
                <p className="text-white text-xl font-bold">{totalCandidatos}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <Building className="h-5 w-5 text-white/80" />
              <div>
                <p className="text-white/80 text-sm">Partidos</p>
                <p className="text-white text-xl font-bold">{totalPartidos}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-5 w-5 text-white/80" />
              <div>
                <p className="text-white/80 text-sm">Fuentes</p>
                <p className="text-white text-xl font-bold">{fuentesUnicas}</p>
              </div>
            </div>
          </div>
        </div>
        
        {ultimaActualizacion && (
          <div className="mt-6 flex items-center space-x-2 text-purple-100">
            <Clock className="h-4 w-4" />
            <span>
              Última actualización: {ultimaActualizacion.toLocaleTimeString('es-CO', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        )}
      </div>

      {/* Content Mejorado */}
      <div className="p-8">
        {noticias.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-100 p-6 rounded-full w-fit mx-auto mb-6">
              <Newspaper className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">No hay noticias disponibles</h3>
            <p className="text-gray-600 text-lg">No se encontraron noticias electorales para mostrar en este momento.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {noticias.map((noticia, index) => (
              <article
                key={index}
                className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50"
              >
                {/* Header de la noticia */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 leading-tight mb-3">
                        {noticia.title}
                      </h2>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span className="font-medium">{formatearFecha(noticia.date)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Newspaper className="h-4 w-4" />
                          <span className="font-medium">{noticia.source}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleExpansion(index)}
                      className="ml-4 bg-purple-100 hover:bg-purple-200 text-purple-700 p-2 rounded-lg transition-colors"
                      title={noticiaExpandida === index ? "Contraer" : "Expandir"}
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Candidatos y Partidos */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
                    {/* Candidatos */}
                    {noticia.candidates && noticia.candidates.length > 0 && (
                      <div>
                        <div className="flex items-center space-x-2 mb-3">
                          <Users className="h-4 w-4 text-purple-600" />
                          <span className="font-semibold text-gray-700">Candidatos Mencionados:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {noticia.candidates.map((candidato, idx) => (
                            <span
                              key={idx}
                              className={`px-3 py-1 rounded-full text-sm font-medium ${obtenerColorCandidato(idx)}`}
                            >
                              {candidato}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Partidos Políticos */}
                    {noticia.political_parties && noticia.political_parties.length > 0 && (
                      <div>
                        <div className="flex items-center space-x-2 mb-3">
                          <Building className="h-4 w-4 text-indigo-600" />
                          <span className="font-semibold text-gray-700">Partidos Políticos:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {noticia.political_parties.map((partido, idx) => (
                            <span
                              key={idx}
                              className={`px-3 py-1 rounded-full text-sm font-medium ${obtenerColorPartido(partido)}`}
                            >
                              {partido}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contenido de la noticia */}
                <div className="p-6">
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {noticiaExpandida === index 
                        ? noticia.content 
                        : truncarTexto(noticia.content, 300)
                      }
                    </p>
                  </div>

                  {noticia.content && noticia.content.length > 300 && (
                    <button
                      onClick={() => toggleExpansion(index)}
                      className="mt-4 text-purple-600 hover:text-purple-700 font-medium transition-colors inline-flex items-center space-x-1"
                    >
                      <span>{noticiaExpandida === index ? 'Ver menos' : 'Leer más'}</span>
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Footer con estadísticas */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4 text-gray-600">
                      <span className="flex items-center space-x-1">
                        <Star className="h-4 w-4" />
                        <span>Noticia #{index + 1}</span>
                      </span>
                      {noticia.candidates && (
                        <span>{noticia.candidates.length} candidato{noticia.candidates.length !== 1 ? 's' : ''}</span>
                      )}
                      {noticia.political_parties && (
                        <span>{noticia.political_parties.length} partido{noticia.political_parties.length !== 1 ? 's' : ''}</span>
                      )}
                    </div>
                    <div className="text-gray-500">
                      {noticia.content ? `${noticia.content.length} caracteres` : 'Sin contenido'}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
      
      {/* Footer Global Mejorado */}
      {noticias.length > 0 && (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <span className="font-semibold text-gray-900">
                📊 Resumen: {noticias.length} noticias • {totalCandidatos} candidatos • {totalPartidos} partidos
              </span>
            </div>
            <button
              onClick={cargarNoticias}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 font-medium shadow-lg"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Actualizar</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticiasDelDia;
