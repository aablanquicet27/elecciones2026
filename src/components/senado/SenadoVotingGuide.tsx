import { CheckCircle2, AlertCircle, ExternalLink, Info } from 'lucide-react';

const TarjetonCard = ({
  number,
  title,
  description,
  color,
  details,
}: {
  number: string;
  title: string;
  description: string;
  color: string;
  details: string[];
}) => (
  <div className={`rounded-3xl border-2 p-8 flex flex-col gap-4 ${color}`}>
    <div className="flex items-center gap-4">
      <div className="text-4xl font-black opacity-80">{number}</div>
      <h3 className="text-2xl font-bold">{title}</h3>
    </div>
    <p className="text-base leading-relaxed opacity-90">{description}</p>
    <ul className="space-y-2 mt-2">
      {details.map((d, i) => (
        <li key={i} className="flex items-start gap-2 text-sm">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 opacity-70" />
          <span>{d}</span>
        </li>
      ))}
    </ul>
  </div>
);

const SenadoVotingGuide = () => {
  return (
    <section className="section-premium bg-purple-900 text-white">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <header className="text-center mb-16">
            <span className="inline-block py-1.5 px-4 rounded-full bg-purple-800/50 border border-purple-500/30 text-purple-200 font-semibold text-sm mb-6 tracking-wider uppercase">
              Guía de Votación
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              ¿Cómo votar informado?
            </h2>
            <p className="text-xl text-purple-200 max-w-2xl mx-auto">
              El 8 de marzo recibirás <strong className="text-white">3 tarjetones</strong>. Aquí te explicamos cada uno.
            </p>
          </header>

          {/* 3 Tarjetones */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <TarjetonCard
              number="1"
              title="Senado Nacional"
              description="Eliges 100 senadores que representan a toda Colombia + 3 de circunscripción indígena."
              color="border-purple-400 bg-purple-800/50 text-purple-100"
              details={[
                'Una lista nacional por partido',
                'Aplica el umbral: partido debe superar ~150.000 votos',
                'Candidatos en lista por número',
              ]}
            />
            <TarjetonCard
              number="2"
              title="Cámara Departamental"
              description="Eliges representantes de tu departamento. La cantidad de curules varía según la población."
              color="border-pink-400 bg-pink-900/40 text-pink-100"
              details={[
                'Lista departamental por partido',
                'Bogotá elige hasta 18 representantes',
                'Depto. pequeños eligen 2 mínimo',
              ]}
            />
            <TarjetonCard
              number="3"
              title="Consultas Internas"
              description="Algunos partidos realizan consultas el mismo día para elegir candidatos presidenciales o directivos."
              color="border-orange-400 bg-orange-900/40 text-orange-100"
              details={[
                'No todos los partidos tienen consulta',
                'Es voluntario participar en consultas',
                'Revisa si tu partido tiene consulta',
              ]}
            />
          </div>

          {/* Lista preferente vs no preferente */}
          <div className="bg-purple-800/50 rounded-[2.5rem] border border-purple-500/30 p-10 mb-12">
            <h3 className="text-3xl font-bold text-white mb-8 text-center">
              Lista Preferente vs. No Preferente
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-purple-900/80 p-8 rounded-2xl border border-purple-400/30">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-purple-400 text-purple-900 font-black text-lg w-10 h-10 rounded-full flex items-center justify-center">A</span>
                  <h4 className="text-xl font-bold text-white">Lista Preferente (Abierta)</h4>
                </div>
                <p className="text-purple-200 mb-6">
                  Votas por el partido <strong className="text-white">Y</strong> por un candidato específico de esa lista.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                    <span className="text-purple-100 text-sm">Marca el <strong>logo del partido</strong></span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                    <span className="text-purple-100 text-sm">Marca el <strong>número de tu candidato</strong> preferido</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-300 shrink-0 mt-0.5" />
                    <span className="text-purple-200 text-sm">El orden final lo determina la votación individual, no la lista original</span>
                  </div>
                </div>
                <div className="mt-6 bg-green-900/40 border border-green-500/30 rounded-xl p-4 text-sm text-green-300">
                  Partidos con lista preferente: La U, Conservador, Liberal, Cambio Radical, Centro Democrático y más.
                </div>
              </div>

              <div className="bg-purple-900/80 p-8 rounded-2xl border border-purple-400/30">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-pink-400 text-pink-900 font-black text-lg w-10 h-10 rounded-full flex items-center justify-center">B</span>
                  <h4 className="text-xl font-bold text-white">Lista No Preferente (Cerrada)</h4>
                </div>
                <p className="text-purple-200 mb-6">
                  Votas <strong className="text-white">solo por el partido</strong>. El orden lo definió el partido previamente.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                    <span className="text-purple-100 text-sm">Marca <strong>únicamente el logo</strong> del partido</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                    <span className="text-purple-100 text-sm">No puedes elegir un candidato específico</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-300 shrink-0 mt-0.5" />
                    <span className="text-purple-200 text-sm">Las curules van al número 1, 2, 3… según el orden del partido</span>
                  </div>
                </div>
                <div className="mt-6 bg-yellow-900/30 border border-yellow-500/30 rounded-xl p-4 text-sm text-yellow-300">
                  Partidos con lista no preferente: Patriotas, Con Toda, Colombia Segura y Próspera.
                </div>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-purple-800/40 border border-purple-500/30 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-3xl">🧠</span> Tips para votar bien
              </h3>
              <ul className="space-y-4">
                {[
                  'No votes por el primero que suena: investiga quién es en realidad.',
                  'Revisa las listas completas, no solo los cabezas de lista.',
                  'Busca candidatos independientes sin vínculos a maquinarias.',
                  'Verifica si tu candidato tiene procesos judiciales activos.',
                  'Compara las propuestas concretas, no solo las promesas.',
                  'Recuerda: el Congreso aprueba o bloquea TODAS las reformas.',
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-3 text-purple-100 text-sm">
                    <span className="font-black text-purple-300 text-base shrink-0">{i + 1}.</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-purple-800/40 border border-purple-500/30 rounded-3xl p-8 flex flex-col justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="text-3xl">📍</span> ¿Dónde votar?
                </h3>
                <p className="text-purple-200 text-sm leading-relaxed mb-6">
                  Consulta tu puesto de votación en la página oficial de la Registraduría Nacional del Estado Civil. Solo necesitas tu número de cédula.
                </p>
                <a
                  href="https://wsp.registraduria.gov.co/censo/consultar_puesto.php"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-purple-900 font-bold px-6 py-3 rounded-2xl text-sm hover:bg-purple-50 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Consultar puesto de votación
                </a>
              </div>
              <div className="bg-orange-900/40 border border-orange-400/30 rounded-2xl p-5">
                <p className="text-orange-200 text-sm font-medium">
                  <strong className="text-orange-300">Recuerda:</strong> Debes llevar tu cédula de ciudadanía vigente. La votación es el <strong>8 de marzo de 2026</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SenadoVotingGuide;
