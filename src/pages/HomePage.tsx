import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Users, BarChart3, ArrowRight, Award, Target, Calendar, MapPin } from 'lucide-react';
import { Candidate } from '../types/election';
import HeroSection from '../components/HeroSection';
import CandidateGrid from '../components/CandidateGrid';
import StatsOverview from '../components/StatsOverview';
import ResultadoPrimeraVuelta from '../components/ResultadoPrimeraVuelta';
import PollAverageTable from '../components/PollAverageTable';
import PrediccionVueltas from '../components/PrediccionVueltas';
import TrendAnalysis from '../components/TrendAnalysis';
import RegionalMap from '../components/RegionalMap';
import TimelineSection from '../components/TimelineSection';
import ElectoralInsights from '../components/ElectoralInsights';
import NoticiasPreview from '../components/NoticiasPreview';
import Footer from '../components/Footer';

interface HomePageProps {
	candidates: Candidate[];
}

const HomePage: React.FC<HomePageProps> = ({ candidates }) => {
	const [activeSection, setActiveSection] = useState('hero');
	const sectionsRef = useRef<{ [key: string]: HTMLElement | null }>({});

	const scrollToSection = (sectionId: string) => {
		const element = sectionsRef.current[sectionId];
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
			setActiveSection(sectionId);
		}
	};

	const topCandidates = candidates
		.sort((a, b) => b.Intención_Voto_Porcentaje - a.Intención_Voto_Porcentaje)
		.slice(0, 12);

	const totalIntention = candidates.reduce((sum, c) => sum + c.Intención_Voto_Porcentaje, 0);
	const undecided = 100 - totalIntention;

	return (
		<main className="min-h-screen bg-white">
			<nav className="fixed top-0 left-0 right-0 z-50 nav-premium" role="navigation" aria-label="Navegación principal">
				<div className="container mx-auto px-6 lg:px-12 py-5">
					<div className="flex items-center justify-between">
						<Link to="/" className="flex items-center space-x-4 group" aria-label="Ir al inicio">
							<img src="/logoagapai.png" alt="Logo Elecciones Colombia 2026" className="h-12 w-12" />
							<div className="flex flex-col">
								<span className="text-2xl font-bold text-gray-900 tracking-tight leading-tight">Colombia 2026</span>
								<span className="text-sm text-gray-500 leading-tight">Segunda vuelta presidencial</span>
							</div>
						</Link>

						<div className="hidden lg:flex items-center space-x-10">
							<button
								onClick={() => scrollToSection('hero')}
								className={`text-base font-medium transition-colors ${activeSection === 'hero' ? 'text-purple-600' : 'text-gray-600 hover:text-gray-900'}`}
							>
								Inicio
							</button>
							<button
								onClick={() => scrollToSection('prediccion')}
								className={`text-base font-medium transition-colors ${activeSection === 'prediccion' ? 'text-purple-600' : 'text-gray-600 hover:text-gray-900'}`}
							>
								Predicción
							</button>
							<button
								onClick={() => scrollToSection('candidates')}
								className={`text-base font-medium transition-colors ${activeSection === 'candidates' ? 'text-purple-600' : 'text-gray-600 hover:text-gray-900'}`}
							>
								Candidatos
							</button>
							<button
								onClick={() => scrollToSection('noticias')}
								className={`text-base font-medium transition-colors ${activeSection === 'noticias' ? 'text-purple-600' : 'text-gray-600 hover:text-gray-900'}`}
							>
								Noticias
							</button>
							<button
								onClick={() => scrollToSection('insights')}
								className={`text-base font-medium transition-colors ${activeSection === 'insights' ? 'text-purple-600' : 'text-gray-600 hover:text-gray-900'}`}
							>
								Hallazgos
							</button>
							<Link
								to="/senado"
								className="bg-white border-2 border-purple-600 text-purple-600 px-6 py-3 rounded-xl hover:bg-purple-50 transition-all text-base font-semibold"
							>
								Senado →
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

			<section
				ref={(el) => { sectionsRef.current['hero'] = el; }}
				id="hero"
			>
				<HeroSection candidates={topCandidates} undecided={undecided} />
			</section>

			<section
				ref={(el) => { sectionsRef.current['prediccion'] = el; }}
				id="prediccion"
				className="section-premium bg-white"
				aria-label="Predicción de la segunda vuelta"
			>
				<PrediccionVueltas />
			</section>

			<section className="section-premium bg-purple-pastel" aria-label="Resultado de la primera vuelta">
				<ResultadoPrimeraVuelta />
			</section>

			<section className="section-premium bg-white" aria-label="Estadísticas electorales">
				<StatsOverview candidates={candidates} />
			</section>

			<section className="container mx-auto px-6 lg:px-12" aria-label="Promedio de encuestas">
				<PollAverageTable />
			</section>

			<section
				ref={(el) => { sectionsRef.current['insights'] = el; }}
				id="insights"
				className="section-premium bg-purple-pastel"
				aria-label="Hallazgos electorales"
			>
				<ElectoralInsights />
			</section>

			<section
				ref={(el) => { sectionsRef.current['candidates'] = el; }}
				id="candidates"
				className="section-premium bg-gradient-to-b from-white via-purple-50/30 to-white"
				aria-label="Candidatos presidenciales"
			>
				<div className="container mx-auto px-6 lg:px-12">
					<header className="text-center mb-20">
						<h2 className="text-gray-900 mb-6">
							Candidatos y Resultado
						</h2>
						<p className="text-large max-w-3xl mx-auto">
							Estos fueron los resultados de la primera vuelta del 31 de mayo. La segunda vuelta del 21 de junio enfrenta a los dos más votados: Abelardo de la Espriella e Iván Cepeda.
						</p>
					</header>

					<CandidateGrid candidates={topCandidates} />

					<div className="text-center mt-16">
						<Link
							to="/analisis"
							className="btn-primary inline-flex items-center space-x-3"
							aria-label="Ver análisis electoral completo"
						>
							<BarChart3 className="h-5 w-5" />
							<span>Ver Análisis Completo</span>
							<ArrowRight className="h-5 w-5" />
						</Link>
					</div>
				</div>
			</section>

			<section
				ref={(el) => { sectionsRef.current['noticias'] = el; }}
				id="noticias"
				className="section-premium bg-purple-pastel"
				aria-label="Noticias del día"
			>
				<div className="container mx-auto px-6 lg:px-12">
					<NoticiasPreview />
				</div>
			</section>

			<section
				ref={(el) => { sectionsRef.current['analysis'] = el; }}
				id="analysis"
				className="section-premium bg-gradient-to-b from-white to-purple-50/50"
				aria-label="Análisis de tendencias"
			>
				<TrendAnalysis candidates={candidates} />
			</section>

			<section className="section-premium bg-gray-900" aria-label="Análisis regional">
				<RegionalMap />
			</section>

			<section className="section-premium bg-gray-950" aria-label="Cronograma electoral">
				<TimelineSection />
			</section>

			<section className="section-premium bg-purple-pastel" aria-label="Claves de la segunda vuelta">
				<div className="container mx-auto px-6 lg:px-12">
					<header className="text-center mb-20">
						<h2 className="text-gray-900 mb-6">
							Claves del balotaje del 21 de junio
						</h2>
						<p className="text-large">
							Lo que define la segunda vuelta presidencial entre De la Espriella y Cepeda
						</p>
					</header>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
						<article className="card-premium p-10">
							<div className="bg-purple-100 p-4 rounded-2xl w-fit mb-6">
								<TrendingUp className="h-8 w-8 text-purple-600" />
							</div>
							<h3 className="text-gray-900 mb-4">
								De la Espriella ganó la primera vuelta
							</h3>
							<p className="text-gray-600 text-lg mb-6">
								Obtuvo 43,75% frente al 40,9% de Cepeda (~673.000 votos de diferencia). Por primera vez una derecha 'outsider' encabeza una presidencial. Valencia (6,9%) y Fajardo (4,3%) quedaron fuera.
							</p>
							<div className="text-purple-600 font-semibold text-lg">
								Espriella 43,75% · Cepeda 40,9%
							</div>
						</article>

						<article className="card-premium p-10">
							<div className="bg-purple-100 p-4 rounded-2xl w-fit mb-6">
								<Users className="h-8 w-8 text-purple-600" />
							</div>
							<h3 className="text-gray-900 mb-4">
								El voto de centro-derecha define
							</h3>
							<p className="text-gray-600 text-lg mb-6">
								El votante de Valencia y buena parte del de Fajardo migra mayoritariamente a De la Espriella. Esa transferencia anti-gobierno es la clave del balotaje.
							</p>
							<div className="text-purple-600 font-semibold text-lg">
								De la Espriella favorito
							</div>
						</article>

						<article className="card-premium p-10">
							<div className="bg-purple-100 p-4 rounded-2xl w-fit mb-6">
								<Target className="h-8 w-8 text-purple-600" />
							</div>
							<h3 className="text-gray-900 mb-4">
								Favorito en sondeos y mercados
							</h3>
							<p className="text-gray-600 text-lg mb-6">
								AtlasIntel 52,2-44,5; Guarumo 52,6-45; CNC 48,6-44,7. Polymarket le da ~89%. Cepeda apuesta a la abstención de la izquierda y a movilizar su base.
							</p>
							<div className="text-purple-600 font-semibold text-lg">
								Promedio +6.4 · Polymarket 89%
							</div>
						</article>
					</div>

					<div className="mt-20 bg-gray-50 rounded-[2rem] p-12 border border-gray-100">
						<h3 className="text-3xl font-bold text-gray-900 mb-10 text-center">
							Factores clave de la segunda vuelta
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
							<div className="text-center">
								<div className="bg-purple-100 p-4 rounded-2xl w-fit mx-auto mb-4">
									<Users className="h-8 w-8 text-purple-600" />
								</div>
								<h4 className="font-bold text-xl text-gray-900 mb-3">Fórmulas Vice</h4>
								<p className="text-gray-600">
									De la Espriella-Restrepo (moderación económica) frente a Cepeda-Quilcué (voto social e indígena).
								</p>
							</div>
							<div className="text-center">
								<div className="bg-purple-100 p-4 rounded-2xl w-fit mx-auto mb-4">
									<MapPin className="h-8 w-8 text-purple-600" />
								</div>
								<h4 className="font-bold text-xl text-gray-900 mb-3">Mapa del balotaje</h4>
								<p className="text-gray-600">
									Cepeda fuerte en Caribe, Pacífico, Bogotá y Amazonía. De la Espriella en Antioquia, Eje Cafetero, Centro-Oriente y Llanos.
								</p>
							</div>
							<div className="text-center">
								<div className="bg-purple-100 p-4 rounded-2xl w-fit mx-auto mb-4">
									<Calendar className="h-8 w-8 text-purple-600" />
								</div>
								<h4 className="font-bold text-xl text-gray-900 mb-3">21 de junio</h4>
								<p className="text-gray-600">
									Día de la segunda vuelta. El nuevo presidente se posesiona el 7 de agosto de 2026.
								</p>
							</div>
							<div className="text-center">
								<div className="bg-purple-100 p-4 rounded-2xl w-fit mx-auto mb-4">
									<Award className="h-8 w-8 text-purple-600" />
								</div>
								<h4 className="font-bold text-xl text-gray-900 mb-3">Transferencia y abstención</h4>
								<p className="text-gray-600">
									El balotaje se decide por hacia dónde va el voto de Valencia y Fajardo y por la participación de cada orilla.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="py-32 bg-gray-900" aria-label="Llamada a la acción">
				<div className="container mx-auto px-6 lg:px-12 text-center">
					<h2 className="text-white mb-8">
						Mantente Informado
					</h2>
					<p className="text-2xl text-gray-400 mb-12 max-w-2xl mx-auto">
						Accede al análisis más completo de la segunda vuelta presidencial de Colombia 2026
					</p>

					<div className="flex flex-col sm:flex-row gap-6 justify-center">
						<Link
							to="/analisis"
							className="btn-primary inline-flex items-center space-x-3"
						>
							<BarChart3 className="h-5 w-5" />
							<span>Panel de Análisis Completo</span>
						</Link>
					</div>
				</div>
			</section>

			<Footer />
		</main>
	);
};

export default HomePage;
