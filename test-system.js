import { obtenerTodasLasNoticias } from './src/utils/newsApi.ts';

async function testSystem() {
  console.log('🧪 Iniciando pruebas del sistema automatizado...\n');
  
  try {
    // Probar función unificada
    console.log('1️⃣ Probando obtenerTodasLasNoticias()...');
    const resultado = await obtenerTodasLasNoticias();
    
    if (resultado.exito) {
      console.log('✅ Sistema funcionando correctamente!');
      console.log(`📊 Total de noticias: ${resultado.datos.length}`);
      
      // Estadísticas
      const noticiasConHistorial = resultado.datos.filter(n => n.created_at && n.url_hash);
      const noticiasRecientes = resultado.datos.length - noticiasConHistorial.length;
      
      console.log(`📚 Noticias del historial: ${noticiasConHistorial.length}`);
      console.log(`🆕 Noticias recientes: ${noticiasRecientes}`);
      
      // Candidatos y partidos
      const candidatos = [...new Set(resultado.datos.flatMap(n => n.candidates || []))];
      const partidos = [...new Set(resultado.datos.flatMap(n => n.political_parties || []))];
      
      console.log(`👥 Candidatos únicos: ${candidatos.length}`);
      console.log(`🏛️ Partidos únicos: ${partidos.length}`);
      
      // Fuentes
      const fuentes = [...new Set(resultado.datos.map(n => n.source))];
      console.log(`📰 Fuentes únicas: ${fuentes.length}`);
      
      // Mostrar muestra de noticias
      console.log('\n📋 Muestra de noticias:');
      resultado.datos.slice(0, 3).forEach((noticia, i) => {
        console.log(`${i + 1}. ${noticia.title.substring(0, 50)}...`);
        console.log(`   📅 ${noticia.date} | 📰 ${noticia.source}`);
        console.log(`   👥 ${noticia.candidates?.length || 0} candidatos | 🏛️ ${noticia.political_parties?.length || 0} partidos`);
        if (noticia.created_at) {
          console.log(`   💾 Guardado en DB: ${noticia.created_at}`);
        }
        console.log('');
      });
      
    } else {
      console.log('❌ Error en el sistema:', resultado.error);
    }
    
  } catch (error) {
    console.error('💥 Error fatal:', error.message);
  }
}

// Probar servidor si está disponible
async function testServer() {
  console.log('\n2️⃣ Probando servidor (si está disponible)...');
  
  try {
    const response = await fetch('https://elecciones202.onrender.com/health');
    const data = await response.json();
    
    console.log('🌐 Estado del servidor:');
    console.log(`   📡 Estado: ${data.success ? 'Funcionando' : 'Error'}`);
    console.log(`   💾 Caché: ${data.cache}`);
    console.log(`   🗄️ Supabase: ${data.supabase}`);
    console.log(`   🕐 Última actualización: ${data.lastUpdate || 'No disponible'}`);
    
  } catch (error) {
    console.log('⚠️ Servidor no disponible o no configurado');
  }
}

// Ejecutar pruebas
async function runTests() {
  console.log('🚀 Sistema de Noticias Automatizado - Pruebas\n');
  console.log('='.repeat(50));
  
  await testSystem();
  await testServer();
  
  console.log('\n='.repeat(50));
  console.log('🎉 Pruebas completadas!');
  console.log('\n📋 Próximos pasos:');
  console.log('1. Configurar variables de entorno en Render');
  console.log('2. Ejecutar migraciones de Supabase');
  console.log('3. Desplegar usando render.yaml');
  console.log('4. Verificar cron job cada 2 horas');
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(console.error);
}

export { testSystem, testServer }; 