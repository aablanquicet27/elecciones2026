import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, Calendar, ArrowRight, Users, Building } from 'lucide-react';
import { obtenerTodasLasNoticias } from '../utils/newsApi';

interface Noticia {
  id: number;
  title: string;
  content: string;
  date: string;
  source: string;
  candidates: string[];
  political_parties: string[];
  created_at: string;
  url_hash: string;
}

const NoticiasPreview: React.FC = () => {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      const resultado = await obtenerTodasLasNoticias(6, 0);
      if (resultado.exito) {
        setNoticias(resultado.datos);
      }
      setCargando(false);
    };
    cargar();
  }, []);

  const formatearFecha = (fechaString: string) => {
    if (!fechaString) return 'Fecha no disponible';
    try {
      const fecha = new Date(fechaString);
      return fecha.toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Fecha no válida';
    }
  };

  const truncarTexto = (texto: string, limite: number = 150) => {
    if (!texto) return 'Sin contenido disponible';
    if (texto.length <= limite) return texto;
    return texto.substring(0, limite) + '...';
  };

  if (cargando) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse bg-white rounded-2xl p-6 shadow-sm">
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (noticias.length === 0) return null;

  return (
    <div>
      <header className="text-center mb-12">
        <h2 className="text-gray-900 mb-4">Noticias Electorales</h2>
        <p className="text-large max-w-3xl mx-auto">
          Las últimas noticias sobre las elecciones presidenciales de Colombia 2026
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {noticias.map((noticia) => (
          <article
            key={noticia.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            <div className="p-6">
              <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatearFecha(noticia.date)}
                </span>
                <span className="flex items-center gap-1">
                  <Newspaper className="h-3.5 w-3.5" />
                  {noticia.source}
                </span>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-3 leading-tight line-clamp-2">
                {noticia.title}
              </h3>

              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {truncarTexto(noticia.content)}
              </p>

              {noticia.candidates && noticia.candidates.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {noticia.candidates.slice(0, 3).map((c, i) => (
                    <span key={i} className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full text-xs font-medium">
                      {c}
                    </span>
                  ))}
                  {noticia.candidates.length > 3 && (
                    <span className="text-gray-400 text-xs self-center">+{noticia.candidates.length - 3}</span>
                  )}
                </div>
              )}

              {noticia.political_parties && noticia.political_parties.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {noticia.political_parties.slice(0, 2).map((p, i) => (
                    <span key={i} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-medium">
                      {p}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link
          to="/noticias"
          className="btn-primary inline-flex items-center space-x-3"
          aria-label="Ver todas las noticias electorales"
        >
          <Newspaper className="h-5 w-5" />
          <span>Ver Todas las Noticias</span>
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
};

export default NoticiasPreview;
