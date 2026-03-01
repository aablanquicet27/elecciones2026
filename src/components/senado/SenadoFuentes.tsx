import { BookOpen, ExternalLink, Info } from 'lucide-react';

const sources = [
  {
    name: 'ORZA — Análisis de listas al Congreso 2026-2030',
    title: 'Estudio de 204 candidaturas con opción real en el Senado. 77% vinculadas a maquinarias; en posiciones competitivas sube a 83%.',
    url: 'https://orza.com.co/wp-content/uploads/2025/12/ORZA_-Informe-analisis-de-listas-al-Congreso-2026-VF_compressed.pdf',
    note: 'Fuente de: "8 de cada 10 vienen de maquinarias"'
  },
  {
    name: 'Fundación PARES (Paz y Reconciliación)',
    title: 'Candidatas y candidatos cuestionados al Congreso 2026. 195 candidaturas cuestionadas: 78 al Senado, 111 a Cámara.',
    url: 'https://www.pares.com.co/candidatas-y-candidatos-cuestionados-al-congreso-de-la-republica-2026/',
    note: 'Fuente de: 195 candidatos cuestionados, tabla de señalamientos'
  },
  {
    name: 'Cifras y Conceptos — Encuesta de percepción electoral',
    title: '87% no conoce candidatos al Senado (88% para Cámara). Solo el 10% ha definido su voto para Congreso.',
    url: 'https://www.valoraanalitik.com/colombianos-aun-sin-rumbo-politico-8-de-cada-10-no-saben-por-quien-votar-en-2026/',
    note: 'Encuesta mayo 2025 — datos de inicio de campaña'
  },
  {
    name: 'El Espectador — Candidatos con investigaciones judiciales',
    title: 'Investigación sobre candidatos al Congreso con cuentas pendientes: UNGRD, compra de votos, enriquecimiento.',
    url: 'https://www.elespectador.com/politica/elecciones-colombia-2026/asi-han-respondido-los-candidatos-al-congreso-con-investigaciones-judiciales-ungrd-y-compra-de-votos-noticias-hoy/'
  },
  {
    name: 'Infobae Colombia — Candidatos con cuentas pendientes ante la justicia',
    title: 'Reportaje sobre candidatos investigados por la Corte Suprema que compiten en elecciones 2026.',
    url: 'https://www.infobae.com/colombia/2026/02/20/elecciones-2026-los-candidatos-al-congreso-que-llegan-a-las-urnas-con-cuentas-pendientes-ante-la-justicia/'
  },
  {
    name: 'El Tiempo — 26 candidatos con investigaciones en Corte Suprema',
    title: 'Lista de candidatos al Senado y Cámara que enfrentan investigaciones y acusaciones judiciales activas.',
    url: 'https://www.eltiempo.com/politica/elecciones-colombia-2026/la-lista-de-26-candidatos-al-senado-y-la-camara-que-enfrentan-investigaciones-y-acusaciones-en-la-corte-suprema-de-justicia-3518188'
  },
  {
    name: 'Semana — UNGRD y demanda contra 9 congresistas',
    title: 'Ordenan pruebas en demanda que pide "muerte política" de congresistas vinculados a corrupción en la UNGRD.',
    url: 'https://www.semana.com/nacion/articulo/corrupcion-en-la-ungrd-ordenan-pruebas-en-el-estudio-de-la-demanda-que-pide-la-muerte-politica-de-nueve-congresistas/202609/'
  },
  {
    name: 'Cambio Colombia — Investigación PARES sobre cuestionados',
    title: 'Detalle de candidatos cuestionados con procesos judiciales activos al Congreso 2026.',
    url: 'https://cambiocolombia.com/elecciones-colombia-2026/articulo/2026/2/candidatos-cuestionados-elecciones-congreso-2026-investigacion-pares-procesos-judiciales/'
  },
  {
    name: 'El Colombiano — Guía de candidatos al Senado',
    title: 'Guía de candidatos con trayectoria verificable para votar informado el 8 de marzo.',
    url: 'https://www.elcolombiano.com/especiales/elecciones-2026/guia-candidatos-elecciones-senado-2026-CC33571524'
  },
  {
    name: 'IFM Noticias — Análisis ORZA sobre listas',
    title: 'Resumen periodístico del estudio ORZA: cómo se configura la disputa real por el Senado.',
    url: 'https://ifmnoticias.com/analisis-mas-estructura-que-opinion-asi-se-configura-la-disputa-real-por-el-senado-en-2026/'
  },
  {
    name: 'Valora Analitik — Intención de voto Congreso',
    title: 'Solo el 10% tiene claro su voto para el Congreso y el 18% para la presidencia.',
    url: 'https://www.valoraanalitik.com/elecciones-2026-solo-el-10-tiene-claro-su-voto-para-el-congreso-y-el-18-para-la-presidencia/'
  },
  {
    name: 'Invamer — Encuestas de intención de voto Feb 2026',
    title: 'Última encuesta de intención de voto presidencial publicada.',
  },
  {
    name: 'Registraduría Nacional del Estado Civil',
    title: '3.231 candidatos inscritos para elecciones de Congreso 2026.',
    url: 'https://www.registraduria.gov.co/3-231-candidatos-fueron-inscritos-para-las-elecciones-de-Congreso-de-2026.html'
  },
  {
    name: 'PARES — César Lorduy caso homicidio 1979',
    title: 'Investigación sobre candidato de Cambio Radical vinculado a homicidio de Ana Mercedes Ribaldo.',
    url: 'https://www.pares.com.co/ustedes-sabian-que-un-candidato-al-senado-de-cambio-radical-asesino-a-una-mujer-en-barranquilla/'
  },
  {
    name: 'El Colombiano — Richard Aguilar y testigos exiliados',
    title: 'Excongresistas acusados por corrupción quieren volver al poder.',
    url: 'https://www.elcolombiano.com/colombia/richard-aguilar-ballesteros-corrupcion-testigos-exilio-DI33802302'
  }
];

const SenadoFuentes = () => {
  return (
    <section className="py-24 bg-gray-50 border-t border-gray-200 relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4 mb-8">
            <div className="h-12 w-12 rounded-2xl bg-purple-100 flex items-center justify-center flex-shrink-0">
              <BookOpen className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Fuentes de Información</h2>
              <p className="text-gray-500 mt-1">Metodología y datos utilizados para este análisis</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm mb-10">
            <div className="flex items-start space-x-4">
              <Info className="h-6 w-6 text-indigo-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-gray-700 font-medium leading-relaxed">
                  <span className="font-bold text-gray-900">Importante:</span> Los señalamientos documentados corresponden a investigaciones, denuncias o procesos judiciales activos. Todos los candidatos se presumen inocentes hasta sentencia en firme. Distinguimos entre investigado y condenado.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sources.map((source, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-purple-100 transition-all duration-300"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-2">{source.name}</h3>
                <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                  {source.title}
                </p>
                {source.note && (
                  <p className="text-purple-600 text-xs font-semibold mb-3 bg-purple-50 inline-block px-2.5 py-1 rounded-md">
                    {source.note}
                  </p>
                )}
                {source.url && (
                  <div>
                    <a 
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      <span>Ver fuente original</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SenadoFuentes;
