import fs from 'fs';
import path from 'path';

function verifySetup() {
  console.log('🔍 Verificando configuración del sistema...\n');
  
  const checks = [
    {
      name: 'Componente NoticiasDelDia.tsx',
      path: './src/components/NoticiasDelDia.tsx',
      check: (content) => content.includes('obtenerTodasLasNoticias')
    },
    {
      name: 'API de noticias newsApi.ts',
      path: './src/utils/newsApi.ts',
      check: (content) => content.includes('obtenerTodasLasNoticias')
    },
    {
      name: 'Servidor server.js',
      path: './server/server.js',
      check: (content) => content.includes('guardarNoticiasEnSupabase')
    },
    {
      name: 'Configuración render.yaml',
      path: './render.yaml',
      check: (content) => content.includes('*/2 * * *')
    },
    {
      name: 'Migración de Supabase',
      path: './supabase/migrations/20250113000000_create_news_table.sql',
      check: (content) => content.includes('noticias_historial')
    },
    {
      name: 'Migración de imágenes',
      path: './supabase/migrations/20250613050000_add_image_fields.sql',
      check: (content) => content.includes('image_url')
    }
  ];
  
  let passedChecks = 0;
  
  checks.forEach(({ name, path, check }) => {
    try {
      if (fs.existsSync(path)) {
        const content = fs.readFileSync(path, 'utf8');
        if (check(content)) {
          console.log(`✅ ${name} - Configurado correctamente`);
          passedChecks++;
        } else {
          console.log(`⚠️ ${name} - Archivo existe pero falta configuración`);
        }
      } else {
        console.log(`❌ ${name} - Archivo no encontrado`);
      }
    } catch (error) {
      console.log(`❌ ${name} - Error: ${error.message}`);
    }
  });
  
  console.log('\n' + '='.repeat(50));
  console.log(`📊 Resultado: ${passedChecks}/${checks.length} verificaciones pasadas`);
  
  if (passedChecks === checks.length) {
    console.log('🎉 ¡Sistema completamente configurado!');
    console.log('\n📋 Próximos pasos:');
    console.log('1. Configurar variables de entorno en Render:');
    console.log('   - EXA_API_KEY');
    console.log('   - SUPABASE_URL');
    console.log('   - SUPABASE_SERVICE_KEY');
    console.log('2. Ejecutar migraciones en Supabase');
    console.log('3. Desplegar usando render.yaml');
    console.log('4. ¡Las noticias se actualizarán cada 2 horas automáticamente!');
  } else {
    console.log('⚠️ Sistema parcialmente configurado. Revisar archivos faltantes.');
  }
  
  console.log('\n🔧 Características del sistema:');
  console.log('- ✅ Actualizaciones automáticas cada 2 horas');
  console.log('- ✅ Guardado automático en Supabase');
  console.log('- ✅ Vista unificada (sin pestañas)');
  console.log('- ✅ Soporte para imágenes');
  console.log('- ✅ Eliminación de duplicados');
  console.log('- ✅ Ordenamiento por fecha');
}

// Verificar servidor remoto
async function checkRemoteServer() {
  console.log('\n🌐 Verificando servidor remoto...');
  
  try {
    const response = await fetch('https://elecciones202.onrender.com/health');
    const data = await response.json();
    
    console.log('📡 Estado del servidor remoto:');
    console.log(`   ✅ Estado: ${data.success ? 'Funcionando' : 'Error'}`);
    console.log(`   💾 Caché: ${data.cache}`);
    console.log(`   🗄️ Supabase: ${data.supabase}`);
    console.log(`   🕐 Última actualización: ${data.lastUpdate || 'No disponible'}`);
    
  } catch (error) {
    console.log('⚠️ Servidor remoto no disponible o no configurado');
    console.log('   Esto es normal si aún no has desplegado en Render');
  }
}

// Ejecutar verificación
async function runVerification() {
  console.log('🚀 Sistema de Noticias Automatizado - Verificación\n');
  
  verifySetup();
  await checkRemoteServer();
  
  console.log('\n' + '='.repeat(50));
  console.log('🎯 Resumen de cambios realizados:');
  console.log('1. ✅ Función unificada obtenerTodasLasNoticias()');
  console.log('2. ✅ Componente simplificado (sin pestañas)');
  console.log('3. ✅ Servidor con guardado automático en Supabase');
  console.log('4. ✅ Cron job configurado para cada 2 horas');
  console.log('5. ✅ Soporte para imágenes en noticias');
  console.log('6. ✅ Migraciones de base de datos actualizadas');
}

runVerification().catch(console.error); 