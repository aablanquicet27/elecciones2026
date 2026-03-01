import { Link } from 'react-router-dom';
import { TrendingUp, Share2 } from 'lucide-react';

const SenadoCTA = () => {
  const shareText = encodeURIComponent(
    '¿Sabes quién está en las listas al Senado? El 8 de marzo decides. Infórmate antes de votar:'
  );
  const shareUrl = encodeURIComponent('https://eleccionescolombia.org/senado');

  const handleShareWhatsApp = () => {
    window.open(`https://wa.me/?text=${shareText}%20${shareUrl}`, '_blank');
  };

  const handleShareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`, '_blank');
  };

  const handleShareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('¡Enlace copiado! Compártelo con quien quieras.');
    } catch {
      // fallback: do nothing
    }
  };

  return (
    <section className="py-24 md:py-32 bg-gray-900" aria-label="Llamada a la acción">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main message */}
          <div className="mb-12">
            <span className="inline-block py-1.5 px-4 rounded-full bg-orange-500/20 border border-orange-400/30 text-orange-300 font-semibold text-sm mb-8 tracking-wider uppercase">
              El poder está en tu voto
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight tracking-tighter">
              El sistema quiere que votes<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
                confundido.
              </span>
            </h2>
            <h3 className="text-3xl md:text-5xl font-black text-white mb-8 leading-tight tracking-tighter">
              Nosotros queremos que votes<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                informado.
              </span>
            </h3>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              El 8 de marzo no te quedes en casa. Infórmate, analiza y vota a conciencia para el Senado y la Cámara de Representantes. Tu voto es el único poder real que tienes frente al sistema.
            </p>
          </div>

          {/* Share section */}
          <div className="bg-gray-800/60 border border-gray-700 rounded-3xl p-8 md:p-10 mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Share2 className="h-6 w-6 text-purple-400" />
              <h3 className="text-xl font-bold text-white">Comparte esta información</h3>
            </div>
            <p className="text-gray-400 mb-8 text-sm">
              El 88% de colombianos no conoce los candidatos al Senado. Cambia eso compartiendo esta página.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={handleShareWhatsApp}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-2xl transition-colors text-sm"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </button>
              <button
                onClick={handleShareTwitter}
                className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-bold px-6 py-3 rounded-2xl transition-colors text-sm"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.738l7.737-8.835L1.254 2.25H8.08l4.26 5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                X / Twitter
              </button>
              <button
                onClick={handleShareFacebook}
                className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-3 rounded-2xl transition-colors text-sm"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </button>
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-2 bg-gray-600 hover:bg-gray-500 text-white font-bold px-6 py-3 rounded-2xl transition-colors text-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copiar enlace
              </button>
            </div>
          </div>

          {/* Navigation CTA */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/"
              className="btn-primary inline-flex items-center justify-center space-x-3"
            >
              <span>Ver Candidatos Presidenciales</span>
              <TrendingUp className="h-5 w-5" />
            </Link>
          </div>

          <p className="mt-8 text-gray-600 text-sm">
            Colombia 2026 • Información electoral independiente
          </p>
        </div>
      </div>
    </section>
  );
};

export default SenadoCTA;
