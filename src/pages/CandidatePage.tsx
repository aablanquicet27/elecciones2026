import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, Users, Award, MapPin, Calendar } from 'lucide-react';
import { getCandidateImage } from '../utils/candidateImages';
import { Candidate } from '../types/election';

interface CandidatePageProps {
  candidates: Candidate[];
}

const biographies: { [key: string]: string } = {
  "Gustavo Bolívar": "Gustavo Bolívar Moreno, nacido el 22 de julio de 1966 en Girardot, Cundinamarca, es un reconocido escritor, guionista y político colombiano. Antes de incursionar en la política, se destacó por su trabajo en la televisión, siendo autor de exitosas series. Su carrera política lo ha llevado a ser Senador de la República y, más recientemente, director del Departamento de Prosperidad Social. Bolívar es una figura prominente de la izquierda colombiana y miembro del Pacto Histórico, conocido por sus posturas críticas y su activismo social.",
  "Vicky Dávila": "Victoria Eugenia Dávila Hoyos, conocida como Vicky Dávila, nació el 30 de mayo de 1973 en Buga, Valle del Cauca. Es una destacada periodista, presentadora de radio y televisión colombiana con una larga trayectoria en los medios de comunicación. Fue directora de la Revista Semana, cargo desde el cual generó gran impacto y controversia. Recientemente, ha incursionado en la política como candidata por firmas, representando una postura de derecha. Su carrera ha estado marcada por su estilo directo y sus opiniones firmes.",
  "Sergio Fajardo": "Sergio Fajardo Valderrama, nacido el 19 de junio de 1956 en Medellín, es un matemático, académico y político colombiano. Reconocido por su enfoque en la educación y la innovación, ha ocupado importantes cargos como Alcalde de Medellín y Gobernador de Antioquia, donde impulsó proyectos de transformación urbana y social. Es una figura central en la política colombiana, representando al centro y siendo parte de la coalición Centro Esperanza. Su trayectoria se caracteriza por su discurso moderado y su énfasis en la gestión pública transparente.",
  "Germán Vargas Lleras": "Germán Vargas Lleras, nacido el 19 de febrero de 1962 en Bogotá, es un abogado y político colombiano con una extensa trayectoria. Ha ocupado importantes cargos como Vicepresidente de Colombia, Ministro del Interior, Ministro de Vivienda y Senador de la República. Es una figura influyente del partido Cambio Radical y ha sido un actor clave en la política nacional durante varias décadas. Su carrera se ha caracterizado por su liderazgo en proyectos de infraestructura y su postura de derecha.",
  "Claudia López": "Claudia Nayibe López Hernández, nacida el 9 de marzo de 1970 en Bogotá, es una política y activista colombiana. Fue la primera mujer en ser elegida Alcaldesa Mayor de Bogotá, cargo que ocupó entre 2020 y 2023. Anteriormente, se desempeñó como Senadora de la República. López es una figura destacada del centro político, conocida por su lucha contra la corrupción y su activismo por los derechos de las mujeres y la comunidad LGBTQ+. Su gestión en la alcaldía se centró en temas de movilidad, seguridad y medio ambiente.",
  "María Fernanda Cabal": "María Fernanda Cabal Molina, nacida el 8 de agosto de 1966 en Cali, es una politóloga, empresaria y política colombiana. Es una de las senadoras más representativas del Centro Democrático, partido de derecha. Conocida por sus posturas firmes y conservadoras, Cabal ha sido una voz activa en temas como la seguridad, la economía y la defensa de la propiedad privada. Su carrera política se ha caracterizado por su fuerte oposición a los gobiernos de izquierda y su defensa de los principios de su partido.",
  "Miguel Uribe Turbay": "Miguel Uribe Turbay, nacido el 28 de enero de 1986 en Bogotá, es un abogado y político colombiano. Miembro del partido Centro Democrático, ha escalado rápidamente en la política nacional, desempeñándose como Concejal de Bogotá y actualmente como Senador de la República. Es nieto del expresidente Julio César Turbay Ayala y ha sido una figura activa en la oposición al gobierno actual. Su carrera se ha enfocado en temas de seguridad y desarrollo urbano, consolidándose como una de las voces jóvenes de la derecha colombiana.",
  "Juan Manuel Galán": "Juan Manuel Galán Pachón, nacido el 29 de julio de 1972 en Bogotá, es un político colombiano, hijo del asesinado líder liberal Luis Carlos Galán Sarmiento. Ha sido Senador de la República por varios periodos, destacándose por su trabajo en temas de salud, educación y lucha contra las drogas. Es una figura importante del Nuevo Liberalismo, partido que busca rescatar los ideales de su padre. Su trayectoria política ha estado marcada por su compromiso con la renovación de la política y la construcción de una sociedad más justa.",
  "Daniel Quintero": "Daniel Quintero Calle, nacido el 26 de julio de 1980 en Medellín, es un ingeniero electrónico, empresario de software y político colombiano. Se desempeñó como Alcalde de Medellín, cargo desde el cual impulsó proyectos de innovación y desarrollo tecnológico. Es una figura de izquierda, conocido por su gestión en la capital antioqueña y su activismo en redes sociales. Su carrera política ha estado marcada por su cercanía con el Pacto Histórico y su enfoque en la transformación digital y social de la ciudad.",
  "María José Pizarro": "María José Pizarro Rodríguez, nacida el 30 de marzo de 1978 en Bogotá, es una artista, activista y política colombiana. Hija del líder del M-19 Carlos Pizarro Leongómez, ha dedicado su carrera a la defensa de la paz, los derechos humanos y la memoria histórica. Actualmente es Senadora de la República por el Pacto Histórico y ha sido una voz importante en el Congreso en temas relacionados con el conflicto armado y la reconciliación. Su trayectoria está marcada por su historia familiar y su compromiso con la construcción de un país más justo y equitativo.",
  "Jota Pe Hernández": "Jonathan Ferney Pulido Hernández, conocido como Jota Pe Hernández, nacido el 6 de enero de 1992 en Bucaramanga, es un youtuber, predicador, músico cristiano y político colombiano. Ganó reconocimiento por su activismo en redes sociales antes de incursionar en la política. Actualmente es Senador de la República, llegando al Congreso como candidato por firmas. Su trayectoria se ha caracterizado por su cercanía con movimientos ciudadanos y su defensa de causas sociales, utilizando las plataformas digitales como herramienta de comunicación y movilización.",
  "Juan Daniel Oviedo": "Juan Daniel Oviedo Arango, nacido el 16 de marzo de 1977 en Bogotá, es un economista y político colombiano. Reconocido por su gestión como director del Departamento Administrativo Nacional de Estadística (DANE), donde modernizó la recolección y difusión de datos en Colombia. Su perfil técnico y su enfoque en la información basada en evidencia lo han llevado a incursionar en la política, siendo considerado una figura independiente. Su trayectoria se ha caracterizado por su transparencia y su interés en la resolución de problemas estructurales del país a través de datos y análisis."
};

const CandidatePage: React.FC<CandidatePageProps> = ({ candidates }) => {
  const { slug } = useParams<{ slug: string }>();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  
  useEffect(() => {
    if (slug && candidates.length > 0) {
      const foundCandidate = candidates.find(
        c => c.Candidato.toLowerCase().replace(/\s+/g, '-') === slug
      );
      
      if (foundCandidate) {
        setCandidate(foundCandidate);
      }
    }
  }, [slug, candidates]);

  if (!candidate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-2xl font-bold mb-4">Candidato no encontrado</div>
          <Link to="/" className="inline-flex items-center space-x-2 bg-[#F7F0E8] text-purple-900 px-4 py-2 rounded-lg">
            <ArrowLeft className="h-4 w-4" />
            <span>Volver al inicio</span>
          </Link>
        </div>
      </div>
    );
  }

  const getImage = (name: string) => getCandidateImage(name, 400);

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'Izquierda': return 'bg-red-100 text-red-800 border-red-200';
      case 'Centro': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Derecha': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const balance = candidate.Favorabilidad - candidate.Desfavorabilidad;
  const getBalanceColor = (balance: number) => {
    if (balance > 0) return 'text-green-600';
    if (balance < -10) return 'text-red-600';
    return 'text-orange-600';
  };

  return (
    <div className="min-h-screen bg-[#F7F0E8]">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 via-purple-800 to-purple-900 text-white">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
            <Link to="/" className="inline-flex items-center space-x-2 text-purple-200 hover:text-white mb-4 md:mb-0">
              <ArrowLeft className="h-5 w-5" />
              <span>Volver al listado</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <div className="bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                <span className="text-sm font-medium">Actualizado: Junio 2025</span>
              </div>
              <div className="bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                <span className="text-sm font-medium">Elecciones 2026</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-1 flex flex-col items-center">
              <div className="relative">
                <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-[#F7F0E8] shadow-xl">
                  <img 
                    src={getImage(candidate.Candidato)} 
                    alt={candidate.Candidato}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-purple-600 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                  #{candidate.Ranking}
                </div>
              </div>
              
              <div className={`mt-6 px-4 py-2 rounded-full text-sm font-medium border ${getTrendColor(candidate.Tendencia_Política)}`}>
                {candidate.Tendencia_Política}
              </div>
            </div>
            
            <div className="md:col-span-2">
              <h1 className="text-4xl font-bold mb-2">{candidate.Candidato}</h1>
              <p className="text-xl text-purple-200 mb-6">{candidate.Cargo_Actual}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                  <div className="text-3xl font-bold text-white">{candidate.Intención_Voto_Porcentaje}%</div>
                  <div className="text-sm text-purple-200">Intención de voto</div>
                </div>
                <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                  <div className="text-3xl font-bold text-white">{candidate.Favorabilidad}%</div>
                  <div className="text-sm text-purple-200">Favorabilidad</div>
                </div>
                <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                  <div className="text-3xl font-bold text-white">{candidate.Desfavorabilidad}%</div>
                  <div className="text-sm text-purple-200">Desfavorabilidad</div>
                </div>
                <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                  <div className={`text-3xl font-bold ${balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {balance > 0 ? '+' : ''}{balance}
                  </div>
                  <div className="text-sm text-purple-200">Balance</div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full">
                  <MapPin className="h-4 w-4" />
                  <span>{candidate.Región_Origen}</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full">
                  <Calendar className="h-4 w-4" />
                  <span>{candidate.Edad} años</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full">
                  <Users className="h-4 w-4" />
                  <span>{candidate.Generación}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Perfil Político</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Partido / Movimiento</h3>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-xl font-medium text-purple-800">{candidate.Partido_Movimiento}</div>
                    <div className="text-sm text-gray-600 mt-1">{candidate.Tipo_Candidatura}</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Trayectoria Política</h3>
                  <div className="prose text-gray-600">
                    {biographies[candidate.Candidato] ? (
                      <p>{biographies[candidate.Candidato]}</p>
                    ) : (
                      <>
                        <p>
                          {candidate.Candidato} es un político colombiano con experiencia en {candidate.Cargo_Actual.toLowerCase()}. 
                          Pertenece a la tendencia {candidate.Tendencia_Política.toLowerCase()} del espectro político y 
                          actualmente se desempeña como {candidate.Cargo_Actual}.
                        </p>
                        <p>
                          Originario de {candidate.Región_Origen}, ha desarrollado su carrera política 
                          representando los intereses de esta región y promoviendo políticas alineadas 
                          con su visión {candidate.Tendencia_Política.toLowerCase()} del país.
                        </p>
                      </>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Posicionamiento Electoral</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Intención de voto</span>
                        <span className="text-sm font-bold text-purple-600">{candidate.Intención_Voto_Porcentaje}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-purple-600 h-2.5 rounded-full" 
                          style={{ width: `${Math.min(candidate.Intención_Voto_Porcentaje * 6, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">Favorabilidad</span>
                          <span className="text-sm font-bold text-green-600">{candidate.Favorabilidad}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-green-500 h-2.5 rounded-full" 
                            style={{ width: `${candidate.Favorabilidad}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">Desfavorabilidad</span>
                          <span className="text-sm font-bold text-red-600">{candidate.Desfavorabilidad}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-red-500 h-2.5 rounded-full" 
                            style={{ width: `${candidate.Desfavorabilidad}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Análisis Electoral</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-purple-800 mb-2">Fortalezas</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <span className="text-purple-500 mr-2">•</span>
                        <span>
                          {candidate.Favorabilidad > 35 ? 'Alta favorabilidad entre el electorado' : 
                           candidate.Favorabilidad > 25 ? 'Favorabilidad moderada' : 
                           'Base de apoyo leal aunque reducida'}
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-500 mr-2">•</span>
                        <span>
                          {candidate.Tendencia_Política === 'Centro' ? 'Posición centrista atractiva para votantes moderados' : 
                           candidate.Tendencia_Política === 'Izquierda' ? 'Fuerte apoyo en sectores progresistas' : 
                           'Respaldo significativo en sectores conservadores'}
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-500 mr-2">•</span>
                        <span>
                          {candidate.Región_Origen === 'Bogotá' ? 'Fuerte presencia en la capital' : 
                           `Arraigo regional en ${candidate.Región_Origen}`}
                        </span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-[#F7F0E8] p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Desafíos</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <span className="text-gray-500 mr-2">•</span>
                        <span>
                          {candidate.Desfavorabilidad > 45 ? 'Alta desfavorabilidad limita crecimiento potencial' : 
                           candidate.Desfavorabilidad > 35 ? 'Desfavorabilidad moderada a superar' : 
                           'Necesita aumentar reconocimiento entre el electorado'}
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-gray-500 mr-2">•</span>
                        <span>
                          {candidate.Intención_Voto_Porcentaje < 5 ? 'Baja intención de voto actual' : 
                           candidate.Intención_Voto_Porcentaje < 10 ? 'Intención de voto moderada' : 
                           'Consolidar apoyo frente a competencia directa'}
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-gray-500 mr-2">•</span>
                        <span>
                          {candidate.Tendencia_Política === 'Centro' ? 'Competencia en el espacio de centro político' : 
                           candidate.Tendencia_Política === 'Izquierda' ? 'Fragmentación en el espectro de izquierda' : 
                           'Disputas internas en el sector de derecha'}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Proyección Electoral</h3>
                  <div className="bg-gradient-to-r from-purple-50 to-[#F7F0E8] p-4 rounded-lg">
                    <p className="text-gray-700">
                      {candidate.Intención_Voto_Porcentaje > 10 ? 
                        `Con una intención de voto del ${candidate.Intención_Voto_Porcentaje}%, ${candidate.Candidato} se posiciona entre los candidatos con mayores posibilidades de pasar a segunda vuelta.` : 
                        candidate.Intención_Voto_Porcentaje > 5 ? 
                        `Con ${candidate.Intención_Voto_Porcentaje}% de intención de voto, ${candidate.Candidato} necesita consolidar alianzas para mejorar sus perspectivas electorales.` : 
                        `Con ${candidate.Intención_Voto_Porcentaje}% de intención actual, ${candidate.Candidato} enfrenta el desafío de aumentar significativamente su apoyo para ser competitivo.`
                      }
                    </p>
                    <p className="text-gray-700 mt-2">
                      {balance > 0 ? 
                        `Su balance de favorabilidad positivo (+${balance}) le otorga potencial de crecimiento en segunda vuelta.` : 
                        balance > -15 ? 
                        `Su balance de favorabilidad (${balance}) representa un desafío moderado para crecer en segunda vuelta.` : 
                        `Su alto nivel de rechazo (balance de ${balance}) limita significativamente su techo electoral en segunda vuelta.`
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Datos Demográficos</h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Edad</span>
                    <span className="font-medium">{candidate.Edad} años</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-purple-600 h-1.5 rounded-full" 
                      style={{ width: `${(candidate.Edad / 80) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Generación</span>
                  <span className="font-medium text-gray-900">{candidate.Generación}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Región de origen</span>
                  <span className="font-medium text-gray-900">{candidate.Región_Origen}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Tipo de candidatura</span>
                  <span className="font-medium text-gray-900">{candidate.Tipo_Candidatura}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Comparativa</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Intención de voto</span>
                  </div>
                  <span className="font-bold text-purple-600">{candidate.Intención_Voto_Porcentaje}%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Promedio {candidate.Tendencia_Política}</span>
                  </div>
                  <span className="font-bold text-green-600">
                    {candidate.Tendencia_Política === 'Izquierda' ? '23.0%' : 
                     candidate.Tendencia_Política === 'Centro' ? '27.0%' : 
                     '29.0%'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Promedio general</span>
                  </div>
                  <span className="font-bold text-red-600">8.2%</span>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600 mb-2">Posición relativa</div>
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-200 h-2 rounded-l-full overflow-hidden">
                      <div className="bg-purple-600 h-full" style={{ width: '100%' }}></div>
                    </div>
                    <div className="px-2 text-sm font-bold">#{candidate.Ranking}</div>
                    <div className="flex-1 bg-gray-200 h-2 rounded-r-full"></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1°</span>
                    <span>32°</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Análisis Regional</h2>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Caribe</span>
                    <span className="font-medium text-gray-900">
                      {candidate.Candidato === 'Gustavo Bolívar' ? '25.9%' : 
                       candidate.Candidato === 'Sergio Fajardo' ? '20.1%' : 
                       candidate.Candidato === 'Vicky Dávila' ? '8.4%' : 
                       candidate.Candidato === 'María Fernanda Cabal' ? '6.2%' : 
                       candidate.Candidato === 'Germán Vargas Lleras' ? '7.5%' : '5.2%'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-purple-600 h-1.5 rounded-full" 
                      style={{ 
                        width: `${
                          candidate.Candidato === 'Gustavo Bolívar' ? 100 : 
                          candidate.Candidato === 'Sergio Fajardo' ? 78 : 
                          candidate.Candidato === 'Vicky Dávila' ? 32 : 
                          candidate.Candidato === 'María Fernanda Cabal' ? 24 : 
                          candidate.Candidato === 'Germán Vargas Lleras' ? 29 : 20
                        }%` 
                      }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Andina</span>
                    <span className="font-medium text-gray-900">
                      {candidate.Candidato === 'Gustavo Bolívar' ? '10.2%' : 
                       candidate.Candidato === 'Sergio Fajardo' ? '12.8%' : 
                       candidate.Candidato === 'Vicky Dávila' ? '12.5%' : 
                       candidate.Candidato === 'María Fernanda Cabal' ? '8.4%' : 
                       candidate.Candidato === 'Germán Vargas Lleras' ? '6.2%' : '5.8%'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-purple-600 h-1.5 rounded-full" 
                      style={{ 
                        width: `${
                          candidate.Candidato === 'Gustavo Bolívar' ? 80 : 
                          candidate.Candidato === 'Sergio Fajardo' ? 100 : 
                          candidate.Candidato === 'Vicky Dávila' ? 98 : 
                          candidate.Candidato === 'María Fernanda Cabal' ? 66 : 
                          candidate.Candidato === 'Germán Vargas Lleras' ? 48 : 45
                        }%` 
                      }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Pacífica</span>
                    <span className="font-medium text-gray-900">
                      {candidate.Candidato === 'Gustavo Bolívar' ? '15.8%' : 
                       candidate.Candidato === 'Sergio Fajardo' ? '14.3%' : 
                       candidate.Candidato === 'Vicky Dávila' ? '9.6%' : 
                       candidate.Candidato === 'María Fernanda Cabal' ? '4.1%' : 
                       candidate.Candidato === 'Germán Vargas Lleras' ? '4.5%' : '4.0%'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-purple-600 h-1.5 rounded-full" 
                      style={{ 
                        width: `${
                          candidate.Candidato === 'Gustavo Bolívar' ? 100 : 
                          candidate.Candidato === 'Sergio Fajardo' ? 90 : 
                          candidate.Candidato === 'Vicky Dávila' ? 61 : 
                          candidate.Candidato === 'María Fernanda Cabal' ? 26 : 
                          candidate.Candidato === 'Germán Vargas Lleras' ? 28 : 25
                        }%` 
                      }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Orinoquía</span>
                    <span className="font-medium text-gray-900">
                      {candidate.Candidato === 'Gustavo Bolívar' ? '5.4%' : 
                       candidate.Candidato === 'Sergio Fajardo' ? '8.2%' : 
                       candidate.Candidato === 'Vicky Dávila' ? '15.7%' : 
                       candidate.Candidato === 'María Fernanda Cabal' ? '12.3%' : 
                       candidate.Candidato === 'Germán Vargas Lleras' ? '8.9%' : '5.0%'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-purple-600 h-1.5 rounded-full" 
                      style={{ 
                        width: `${
                          candidate.Candidato === 'Gustavo Bolívar' ? 34 : 
                          candidate.Candidato === 'Sergio Fajardo' ? 52 : 
                          candidate.Candidato === 'Vicky Dávila' ? 100 : 
                          candidate.Candidato === 'María Fernanda Cabal' ? 78 : 
                          candidate.Candidato === 'Germán Vargas Lleras' ? 57 : 32
                        }%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  {candidate.Candidato === 'Gustavo Bolívar' ? 'Mayor fortaleza en región Caribe y Pacífica' : 
                   candidate.Candidato === 'Sergio Fajardo' ? 'Distribución equilibrada en todas las regiones' : 
                   candidate.Candidato === 'Vicky Dávila' ? 'Dominio en Orinoquía y competitiva en región Andina' : 
                   candidate.Candidato === 'María Fernanda Cabal' ? 'Fuerte en Orinoquía, débil en Pacífica' : 
                   candidate.Candidato === 'Germán Vargas Lleras' ? 'Presencia moderada en todas las regiones' : 
                   'Distribución regional variable'}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="mt-12">
          <div className="bg-gradient-to-r from-[#F7F0E8] to-purple-50 rounded-xl p-8 border border-purple-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Escenarios de Segunda Vuelta</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Probabilidades</h3>
                <div className="space-y-4">
                  {candidate.Candidato === 'Gustavo Bolívar' ? (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">vs. Vicky Dávila</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-purple-600 font-semibold">43.5%</span>
                          <span className="text-gray-400">|</span>
                          <span className="text-gray-600 font-semibold">46.8%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">vs. Sergio Fajardo</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-purple-600 font-semibold">41.2%</span>
                          <span className="text-gray-400">|</span>
                          <span className="text-gray-600 font-semibold">48.5%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">vs. María F. Cabal</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-purple-600 font-semibold">42.3%</span>
                          <span className="text-gray-400">|</span>
                          <span className="text-gray-600 font-semibold">44.7%</span>
                        </div>
                      </div>
                    </>
                  ) : candidate.Candidato === 'Vicky Dávila' ? (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">vs. Gustavo Bolívar</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-purple-600 font-semibold">46.8%</span>
                          <span className="text-gray-400">|</span>
                          <span className="text-gray-600 font-semibold">43.5%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">vs. Sergio Fajardo</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-purple-600 font-semibold">35.2%</span>
                          <span className="text-gray-400">|</span>
                          <span className="text-gray-600 font-semibold">38.6%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">vs. Germán Vargas</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-purple-600 font-semibold">37.4%</span>
                          <span className="text-gray-400">|</span>
                          <span className="text-gray-600 font-semibold">32.6%</span>
                        </div>
                      </div>
                    </>
                  ) : candidate.Candidato === 'Sergio Fajardo' ? (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">vs. Gustavo Bolívar</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-purple-600 font-semibold">48.5%</span>
                          <span className="text-gray-400">|</span>
                          <span className="text-gray-600 font-semibold">41.2%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">vs. Vicky Dávila</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-purple-600 font-semibold">38.6%</span>
                          <span className="text-gray-400">|</span>
                          <span className="text-gray-600 font-semibold">35.2%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">vs. Germán Vargas</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-purple-600 font-semibold">45.2%</span>
                          <span className="text-gray-400">|</span>
                          <span className="text-gray-600 font-semibold">28.8%</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">vs. Líder 1</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-purple-600 font-semibold">38.5%</span>
                          <span className="text-gray-400">|</span>
                          <span className="text-gray-600 font-semibold">42.3%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">vs. Líder 2</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-purple-600 font-semibold">36.2%</span>
                          <span className="text-gray-400">|</span>
                          <span className="text-gray-600 font-semibold">44.5%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">vs. Líder 3</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-purple-600 font-semibold">37.8%</span>
                          <span className="text-gray-400">|</span>
                          <span className="text-gray-600 font-semibold">41.2%</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Análisis de Competitividad</h3>
                <div className="prose text-sm text-gray-600">
                  <p>
                    {balance > 0 ? 
                      `${candidate.Candidato} presenta un balance de favorabilidad positivo (+${balance}), lo que le otorga ventaja competitiva en escenarios de segunda vuelta donde la capacidad de atraer votantes indecisos es crucial.` : 
                      balance > -15 ? 
                      `Con un balance de favorabilidad de ${balance} puntos, ${candidate.Candidato} enfrenta desafíos moderados para expandir su base electoral en segunda vuelta, aunque mantiene opciones viables.` : 
                      `El alto nivel de rechazo (${balance} puntos) limita significativamente el techo electoral de ${candidate.Candidato} en escenarios de segunda vuelta, requiriendo estrategias para mejorar su imagen.`
                    }
                  </p>
                  <p>
                    {candidate.Tendencia_Política === 'Centro' ? 
                      `Su posición de centro le permite atraer votantes de ambos extremos del espectro político, aumentando su competitividad en segunda vuelta.` : 
                      candidate.Tendencia_Política === 'Izquierda' ? 
                      `Como candidato de izquierda, su desafío será ampliar su base más allá de su núcleo ideológico para ser competitivo en segunda vuelta.` : 
                      `Su perfil de derecha le otorga una base sólida, pero necesitará moderar su discurso para atraer votantes de centro en un eventual balotaje.`
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="bg-[#F7F0E8] py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-600">
            Panorama Electoral Colombia 2026: Análisis Estadístico Integral
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Datos actualizados a Junio 2025 • Margen de error: ±3.2%
          </p>
          <p className="text-xs text-purple-500 mt-2">
            Desarrollado por <a href="https://brochure.agapai.com.co" className="hover:text-purple-700">AGAPAI</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CandidatePage;