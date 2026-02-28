import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const SenadoHero = () => {
  return (
    <>
      {/* Premium Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 nav-premium" role="navigation">
        <div className="container mx-auto px-6 lg:px-12 py-5">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-4 group">
              <ArrowLeft className="h-6 w-6 text-gray-500 group-hover:text-purple-600 transition-colors" />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900 tracking-tight leading-tight">Volver a Presidenciales</span>
              </div>
            </Link>

            <div className="hidden md:flex items-center space-x-2">
              <img src="/logoagapai.png" alt="Logo" className="h-8 w-8" />
              <span className="font-bold text-gray-900">Colombia 2026</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 bg-purple-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541872703-74c5e44368f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/90 via-purple-900/80 to-purple-900"></div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10 text-center">
          <span className="inline-block py-1.5 px-4 rounded-full bg-purple-800/50 border border-purple-500/30 text-purple-200 font-semibold text-sm mb-8 tracking-wider uppercase">
            Elecciones Legislativas • 8 de Marzo 2026
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tighter leading-none">
            El 90% de Colombia no vota.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
              El otro 10% elige por todos.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto leading-relaxed mb-8 font-medium">
            El 8 de marzo votas por el Congreso de los próximos 4 años. ¿Sabes quién está en las listas?
          </p>
          <div className="max-w-3xl mx-auto bg-white/10 border border-white/20 backdrop-blur-sm rounded-3xl px-8 py-6 text-left">
            <p className="text-purple-100 text-lg leading-relaxed">
              <span className="text-white font-bold">Candidatos investigados por corrupción están en las listas de TODOS los partidos.</span>{' '}
              8 de cada 10 candidatos viables vienen de maquinarias políticas. El 90% del país no ha decidido su voto.{' '}
              <span className="text-orange-300 font-bold">El sistema está diseñado para que votes sin pensar.</span>
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default SenadoHero;
