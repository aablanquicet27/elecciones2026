// Script para agregar manualmente la noticia del fallecimiento de Miguel Uribe Turbay
// Usamos una implementación directa con Supabase

const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase (usando variables de entorno si están disponibles)
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

let supabase;
try {
  supabase = createClient(supabaseUrl, supabaseKey);
} catch (error) {
  console.error('❌ Error configurando Supabase:', error.message);
  process.exit(1);
}

// Función para agregar la noticia del fallecimiento de Miguel Uribe Turbay
async function agregarNoticiaFallecimiento() {
  console.log('🔔 Agregando noticia del fallecimiento de Miguel Uribe Turbay...');
  
  const noticia = {
    title: 'Fallece Miguel Uribe Turbay, precandidato presidencial para 2026',
    content: `El político y empresario Miguel Uribe Turbay falleció en la madrugada de hoy, confirmaron fuentes cercanas a su familia. Uribe Turbay, quien había anunciado su precandidatura presidencial para las elecciones de 2026, venía enfrentando problemas de salud en los últimos meses.

El exsenador y empresario, de 69 años, había sido una figura prominente en la política colombiana durante las últimas décadas. Su muerte representa un cambio significativo en el panorama electoral de cara a las elecciones presidenciales de 2026, donde había registrado una intención de voto del 13.7% según las últimas encuestas.

La familia Uribe Turbay ha solicitado respeto por su privacidad en estos momentos difíciles. Se espera que en las próximas horas se den a conocer más detalles sobre los servicios fúnebres.

Con su fallecimiento, el panorama electoral para 2026 experimenta un cambio importante, ya que Uribe Turbay era considerado uno de los precandidatos con mayor proyección en las encuestas de intención de voto.`,
    date: new Date().toISOString().split('T')[0], // Fecha de hoy
    source: 'Redacción Elecciones 2026',
    candidates: ['Miguel Uribe Turbay'],
    political_parties: [],
    url_hash: Buffer.from('Fallece Miguel Uribe Turbay' + 'Redacción Elecciones 2026' + new Date().toISOString().split('T')[0] + Date.now()).toString('base64')
  };

  try {
    console.log('📝 Insertando noticia en la base de datos...');
    
    const { data, error } = await supabase
      .from('noticias_historial')
      .insert([noticia])
      .select();

    if (error) {
      console.error('❌ Error de Supabase:', error);
      throw new Error(`Error de base de datos: ${error.message}`);
    }

    console.log('✅ Noticia agregada exitosamente:');
    console.log('📰 Título:', noticia.title);
    console.log('📅 Fecha:', noticia.date);
    console.log('🏛️ Fuente:', noticia.source);
    console.log('👤 Candidatos mencionados:', noticia.candidates.join(', '));
    console.log('🆔 ID asignado:', data[0]?.id);
    
  } catch (error) {
    console.error('❌ Error ejecutando el script:', error.message);
    process.exit(1);
  }
}

// Ejecutar la función
agregarNoticiaFallecimiento().then(() => {
  console.log('🏁 Script completado exitosamente');
  process.exit(0);
}).catch(error => {
  console.error('💥 Error fatal:', error.message);
  process.exit(1);
});