import React, { useState, useEffect } from 'react';
import { Newspaper, Clock, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react';
import { obtenerNoticiasProcesadas } from '../utils/newsApi';

interface Noticia {
  title: string;
  content: string;
  url?: string;
  publishedAt?: string;
  source?: {
    name: string;
  };
  urlToImage?: string;
}

const NoticiasDelDia: React.FC = () => {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ultimaActualizacion, setUltimaActualizacion] = useState<Date | null>(null);

  const cargarNoticias = async () => {
    setCargando(true);
    setError(null);
    
    const resultado = await obtenerNoticiasProcesadas();
    
    if (resultado.exito) {
      setNoticias(resultado.datos);
      setUltimaActualizacion(new Date());
    } else {
      setError(resultado.error);
    }
    
    setCargando(false);
  };

  useEffect(() => {
    cargarNoticias();
  }, []);

  const formatearFecha = (fechaString?: string) => {
    if (!fechaString) return 'Fecha no disponible';
    
    try {
      const fecha = new Date(fechaString);
      return fecha.toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Fecha no válida';
    }
  };

  const truncarTexto = (texto: string, limite: number = 150) => {
    if (texto.length <= limite) return texto;
    return texto.substring(0, limite) + '...';
  };

  if (cargando) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-center space-x-3 mb-6">
          <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-purple-600"></div>
          <h2 className="text-2xl font-bold text-gray-900">Cargando Noticias del Día</h2>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center">
          <div className="bg-red-100 p-4 rounded-full w-fit mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error al Cargar Noticias</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={cargarNoticias}
            className="inline-flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Intentar de Nuevo</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Newspaper className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Noticias del Día</h2>
              <p className="text-purple-100">Últimas noticias electorales</p>
            </div>
          </div>
          
          <button
            onClick={cargarNoticias}
            disabled={cargando}
            className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors disabled:opacity-50"
            title="Actualizar noticias"
          >
            <RefreshCw className={`h-5 w-5 ${cargando ? 'animate-spin' : ''}`} />
          </button>
        </div>
        
        {ultimaActualizacion && (
          <div className="mt-4 flex items-center space-x-2 text-purple-100 text-sm">
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

      {/* Content */}
      <div className="p-6">
        {noticias.length === 0 ? (
          <div className="text-center py-8">
            <div className="bg-gray-100 p-4 rounded-full w-fit mx-auto mb-4">
              <Newspaper className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay noticias disponibles</h3>
            <p className="text-gray-600">No se encontraron noticias para mostrar en este momento.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {noticias.map((noticia, index) => (
              <article
                key={index}
                className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:space-x-6">
                  {/* Imagen */}
                  {noticia.urlToImage && (
                    <div className="lg:w-48 lg:flex-shrink-0 mb-4 lg:mb-0">
                      <img
                        src={noticia.urlToImage}
                        alt={noticia.title}
                        className="w-full h-32 lg:h-24 object-cover rounded-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  {/* Contenido */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                        {noticia.title}
                      </h3>
                      {noticia.url && (
                        <a
                          href={noticia.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-3 text-purple-600 hover:text-purple-700 transition-colors flex-shrink-0"
                          title="Leer artículo completo"
                        >
                          <ExternalLink className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                    
                    <p className="text-gray-700 mb-3 leading-relaxed">
                      {truncarTexto(noticia.content)}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        {noticia.source?.name && (
                          <span className="font-medium">{noticia.source.name}</span>
                        )}
                        <span>{formatearFecha(noticia.publishedAt)}</span>
                      </div>
                      
                      {noticia.url && (
                        <a
                          href={noticia.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
                        >
                          Leer más →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
      
      {/* Footer */}
      {noticias.length > 0 && (
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Mostrando {noticias.length} noticias</span>
            <button
              onClick={cargarNoticias}
              className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
            >
              Actualizar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticiasDelDia;
