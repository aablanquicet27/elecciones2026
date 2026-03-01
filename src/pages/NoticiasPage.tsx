import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import NoticiasDelDia from '../components/NoticiasDelDia';
import Footer from '../components/Footer';

const NoticiasPage: React.FC = () => {
  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 nav-premium" role="navigation">
        <div className="container mx-auto px-6 lg:px-12 py-5">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-4 group" aria-label="Ir al inicio">
              <img src="/logoagapai.png" alt="Logo Elecciones Colombia 2026" className="h-12 w-12" />
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-gray-900 tracking-tight leading-tight">Colombia 2026</span>
                <span className="text-sm text-gray-500 leading-tight">Elecciones Presidenciales</span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center space-x-10">
              <Link
                to="/"
                className="text-base font-medium text-gray-600 hover:text-gray-900 transition-colors inline-flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Inicio</span>
              </Link>
              <Link
                to="/analisis"
                className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-all text-base font-semibold shadow-lg shadow-purple-500/20"
              >
                Panel Completo
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <section className="pt-32 pb-20 bg-purple-pastel">
        <div className="container mx-auto px-6 lg:px-12">
          <NoticiasDelDia />
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default NoticiasPage;
