import express from 'express';
import cors from 'cors';
import Exa from 'exa-js';
import { OpenAI } from 'openai';
import { promises as fs } from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

if (!supabase) {
  console.warn('⚠️ Supabase no configurado. Las noticias no se guardarán en la base de datos.');
}

const CACHE_DIR = process.env.RENDER_DISK_MOUNT_PATH || path.dirname(new URL(import.meta.url).pathname.substring(1));
const CACHE_FILE_PATH = path.join(CACHE_DIR, 'cache.json');

if (!process.env.RENDER_DISK_MOUNT_PATH) {
    fs.mkdir(CACHE_DIR, { recursive: true }).catch(console.error);
}

// --- INICIO: JSON Schema Definido ---
// Esta es la plantilla que Exa usará para estructurar la respuesta.
const noticiasSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "Colección de Artículos de Noticias",
  description: "Define la estructura para una lista de artículos, cada uno con sus detalles e imágenes.",
  type: "object",
  required: ["articles"],
  properties: {
    articles: {
      type: "array",
      items: {
        type: "object",
        required: ["title", "date", "source", "content", "candidates", "political_parties"],
        properties: {
          title: {
            type: "string",
            description: "El titular o título del artículo."
          },
          date: {
            type: "string",
            description: "La fecha de publicación en formato AAAA-MM-DD."
          },
          source: {
            type: "string",
            description: "El medio de comunicación que publicó el artículo."
          },
          content: {
            type: "string",
            description: "El cuerpo o resumen del artículo."
          },
          candidates: {
            type: "array",
            items: {
              type: "string"
            },
            description: "Una lista con los nombres de los candidatos mencionados."
          },
          political_parties: {
            type: "array",
            items: {
              type: "string"
            },
            description: "Una lista con los nombres de los partidos políticos mencionados."
          },
          // NUEVOS CAMPOS PARA IMÁGENES
          image_url: {
            type: "string",
            description: "URL de la imagen principal del artículo si está disponible."
          },
          image_alt: {
            type: "string",
            description: "Texto alternativo descriptivo de la imagen."
          },
          has_media: {
            type: "boolean",
            description: "Indica si el artículo contiene elementos multimedia."
          }
        },
        additionalProperties: false
      }
    }
  },
  additionalProperties: false
};
// --- FIN: JSON Schema Definido ---

// Middleware
app.use(cors());
app.use(express.json());

// Inicializar Exa (usando la clave de tu ejemplo)
const exa = new Exa(process.env.EXA_API_KEY || "8c34ddda-1f18-41b8-856d-a1270349b220");

// Inicializar OpenAI client para Exa
const openai = new OpenAI({
  apiKey: process.env.EXA_API_KEY || "8c34ddda-1f18-41b8-856d-a1270349b220",
  baseURL: "https://api.exa.ai"
});

// Variable global para almacenar las últimas noticias
let ultimasNoticias = {
  data: null,
  lastUpdate: null,
  status: 'waiting',
  date: null
};

// --- FUNCIÓN PARA GUARDAR EN SUPABASE ---
async function guardarNoticiasEnSupabase(noticias) {
  if (!supabase) {
    console.warn('⚠️ Supabase no configurado, saltando guardado en BD');
    return { success: false, error: 'Supabase no configurado' };
  }

  try {
    console.log(`💾 Guardando ${noticias.length} noticias en Supabase...`);
    
    const noticiasParaGuardar = noticias.map(noticia => ({
      title: noticia.title,
      content: noticia.content,
      date: noticia.date,
      source: noticia.source,
      candidates: noticia.candidates || [],
      political_parties: noticia.political_parties || [],
      image_url: noticia.image_url || null,
      image_alt: noticia.image_alt || null,
      has_media: noticia.has_media || false,
      url_hash: Buffer.from(noticia.title + noticia.source + noticia.date).toString('base64')
    }));

    const { data, error } = await supabase
      .from('noticias_historial')
      .upsert(noticiasParaGuardar, { 
        onConflict: 'url_hash',
        ignoreDuplicates: true 
      })
      .select();

    if (error) {
      console.error('❌ Error guardando en Supabase:', error);
      return { success: false, error: error.message };
    }

    console.log(`✅ ${data?.length || 0} noticias guardadas en Supabase`);
    return { success: true, data, count: data?.length || 0 };
    
  } catch (error) {
    console.error('❌ Error de conexión con Supabase:', error);
    return { success: false, error: error.message };
  }
}

// --- INICIO: FUNCIONES DE CACHÉ ---
async function guardarNoticiasEnCache() {
  try {
    await fs.writeFile(CACHE_FILE_PATH, JSON.stringify(ultimasNoticias, null, 2));
    console.log(`💾 Cache de noticias guardado en: ${CACHE_FILE_PATH}`);
  } catch (error) {
    console.error('❌ Error al guardar el cache en archivo:', error);
  }
}

async function cargarNoticiasDesdeCache() {
  try {
    await fs.access(CACHE_FILE_PATH);
    const data = await fs.readFile(CACHE_FILE_PATH, 'utf-8');
    ultimasNoticias = JSON.parse(data);
    console.log(`✅ Cache de noticias cargado desde: ${CACHE_FILE_PATH}`);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('ℹ️ No se encontró archivo de cache. Se creará uno en la primera actualización.');
    } else {
      console.error('❌ Error al cargar el cache desde archivo:', error);
    }
  }
}
// --- FIN: FUNCIONES DE CACHÉ ---

// --- FUNCIÓN PRINCIPAL CON SCHEMA Y SUPABASE ---
async function actualizarNoticiasConResearchTask() {
  try {
    console.log('🔄 Iniciando actualización y acumulación de noticias...');
    ultimasNoticias.status = 'updating';

    // 1. Cargar noticias viejas del caché
    let noticiasViejas = [];
    try {
      const data = await fs.readFile(CACHE_FILE_PATH, 'utf-8');
      const cacheViejo = JSON.parse(data);
      if (cacheViejo.data && cacheViejo.data.data && cacheViejo.data.data.articles) {
        noticiasViejas = cacheViejo.data.data.articles;
      }
    } catch (e) {
      console.log('ℹ️ No hay caché previo o es inválido. Se creará desde cero.');
    }
    console.log(`🔍 Encontradas ${noticiasViejas.length} noticias en el caché existente.`);

    // 2. Buscar noticias nuevas en Exa
    const today = new Date().toLocaleDateString('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const currentTime = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
    const instructions = `ENCUENTRA TODAS LAS NOTICIAS RELACIONADAS CON LAS ELECCIONES DE COLOMBIA DE 2026 del ${today}. Incluye información sobre precandidatos, partidos políticos, encuestas, y cualquier desarrollo electoral relevante. Prioriza noticias de las últimas 2 horas. INCLUYE IMÁGENES cuando estén disponibles.`;

    const { id: taskId } = await exa.research.createTask({
      instructions,
      output: { schema: noticiasSchema, inferSchema: false },
      includeContent: true,
      includeImages: true,
    });

    const task = await exa.research.pollTask(taskId);
    const noticiasNuevas = task?.data?.articles || [];
    console.log(`📰 Exa encontró ${noticiasNuevas.length} noticias nuevas.`);

    // 3. Combinar y eliminar duplicados por título
    const titulosViejos = new Set(noticiasViejas.map(n => n.title));
    const noticiasFiltradas = noticiasNuevas.filter(noticiaNueva => !titulosViejos.has(noticiaNueva.title));
    console.log(`➕ Se agregarán ${noticiasFiltradas.length} noticias únicas.`);
    
    // 4. Guardar SOLO las noticias nuevas en Supabase
    if (noticiasFiltradas.length > 0) {
      const resultadoSupabase = await guardarNoticiasEnSupabase(noticiasFiltradas);
      if (resultadoSupabase.success) {
        console.log(`✅ ${resultadoSupabase.count} noticias nuevas guardadas en Supabase`);
      } else {
        console.warn(`⚠️ Error guardando en Supabase: ${resultadoSupabase.error}`);
      }
    }
    
    const articulosCombinados = [...noticiasViejas, ...noticiasFiltradas];

    // 5. Reconstruir el objeto de caché y guardarlo
    const nuevoCache = {
      data: {
        data: { articles: articulosCombinados },
        id: task.id,
        status: task.status
      },
      lastUpdate: new Date().toISOString(),
      status: 'completed',
      date: today,
      time: currentTime,
      taskId,
      updateType: 'automated-2hour-with-supabase',
      supabaseSync: noticiasFiltradas.length > 0
    };

    ultimasNoticias = nuevoCache;
    await guardarNoticiasEnCache();
    
    console.log(`✅ Actualización completada. Total de noticias en caché: ${articulosCombinados.length}`);
    console.log(`💾 Noticias nuevas guardadas en Supabase: ${noticiasFiltradas.length}`);

  } catch (error) {
    console.error('❌ Error en la actualización acumulativa:', error.message);
    ultimasNoticias.status = 'error';
    ultimasNoticias.lastError = error.message;
    // No guardamos el caché si hay un error para no sobreescribir uno bueno.
  }
}

// --- PROGRAMACIÓN AUTOMÁTICA CADA 2 HORAS ---
function iniciarActualizacionAutomatica() {
  console.log('⏰ Configurando actualización automática cada 2 horas...');
  
  // Ejecutar inmediatamente
  actualizarNoticiasConResearchTask();
  
  // Programar cada 2 horas (2 * 60 * 60 * 1000 = 7,200,000 ms)
  setInterval(async () => {
    console.log('🔄 Ejecutando actualización automática programada...');
    await actualizarNoticiasConResearchTask();
  }, 2 * 60 * 60 * 1000);
  
  console.log('✅ Actualización automática configurada exitosamente');
}

// --- ENDPOINTS ---

// Endpoint principal para obtener las noticias diarias estructuradas
app.get('/daily-news', (req, res) => {
  if (ultimasNoticias.status === 'completed' && ultimasNoticias.data) {
    res.json({
      success: true,
      message: "Noticias acumuladas obtenidas exitosamente desde el caché",
      ...ultimasNoticias
    });
  } else {
    res.status(503).json({ 
      success: false, 
      error: "Las noticias no están disponibles o se están actualizando.",
      details: ultimasNoticias.lastError || `Estado actual: ${ultimasNoticias.status}`
    });
  }
});

// Endpoint para forzar una actualización manual (útil para pruebas y para el Cron Job de Render)
app.post('/force-update', async (req, res) => {
  console.log(`🔄 Petición recibida en /force-update. Iniciando actualización acumulativa...`);
  
  // Ejecutar en segundo plano para responder rápidamente
  actualizarNoticiasConResearchTask();
  
  res.status(202).json({
    success: true,
    message: `Actualización acumulativa iniciada. El proceso corre en segundo plano.`,
    timestamp: new Date().toISOString(),
    updateType: 'manual-force-update'
  });
});

// Endpoint para obtener estadísticas de Supabase
app.get('/supabase-stats', async (req, res) => {
  if (!supabase) {
    return res.status(503).json({ 
      success: false, 
      error: 'Supabase no configurado' 
    });
  }

  try {
    const { data, error } = await supabase
      .from('noticias_historial')
      .select('id, created_at, source, candidates, political_parties')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    const stats = {
      totalNoticias: data.length,
      fuentesUnicas: [...new Set(data.map(n => n.source))],
      candidatosMencionados: [...new Set(data.flatMap(n => n.candidates || []))],
      partidosMencionados: [...new Set(data.flatMap(n => n.political_parties || []))],
      ultimaActualizacion: data[0]?.created_at || null
    };

    res.json({
      success: true,
      stats,
      recentArticles: data.slice(0, 10)
    });

  } catch (error) {
    console.error('Error obteniendo estadísticas de Supabase:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Endpoint de salud
app.get('/health', (req, res) => {
  res.json({
    success: true,
    server: 'running',
    cache: ultimasNoticias.status,
    lastUpdate: ultimasNoticias.lastUpdate,
    supabase: supabase ? 'configured' : 'not configured',
    timestamp: new Date().toISOString()
  });
});

// Endpoint alternativo que usa Chat Completions para obtener texto plano
app.get('/daily-news-chat', async (req, res) => {
  try {
    const today = new Date().toLocaleDateString('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const query = `ENCUENTRA TODAS LAS NOTICIAS RELACIONADAS CON LAS ELECCIONES DE COLOMBIA DE 2026 DEL DIA ${today}. Incluye información sobre precandidatos, partidos políticos, encuestas, y cualquier desarrollo electoral relevante. Solo noticias de hoy ${today}.`;

    const response = await openai.chat.completions.create({
      model: "exa-research",
      messages: [{ role: "user", content: query }],
      stream: false,
    });

    res.json({
      success: true,
      data: response.choices[0].message.content,
      format: "text"
    });

  } catch (error) {
    console.error('Error en GET /daily-news-chat:', error);
    res.status(500).json({ success: false, error: "Error al obtener las noticias con chat", details: error.message });
  }
});

// Endpoint para obtener estadísticas de imágenes
app.get('/images-stats', (req, res) => {
  if (ultimasNoticias.status === 'completed' && ultimasNoticias.data) {
    const articles = ultimasNoticias.data.data.articles || [];
    const withImages = articles.filter(article => article.image_url);
    
    res.json({
      success: true,
      stats: {
        totalArticles: articles.length,
        articlesWithImages: withImages.length,
        imagePercentage: ((withImages.length / articles.length) * 100).toFixed(1),
        lastUpdate: ultimasNoticias.lastUpdate
      },
      samples: withImages.slice(0, 5).map(article => ({
        title: article.title,
        source: article.source,
        imageUrl: article.image_url,
        imageAlt: article.image_alt || 'Sin descripción'
      }))
    });
  } else {
    res.status(503).json({ 
      success: false, 
      error: "Las estadísticas de imágenes no están disponibles en este momento."
    });
  }
});

// Iniciar servidor
async function iniciarServidor() {
  await cargarNoticiasDesdeCache();
  
  // Iniciar actualización automática
  iniciarActualizacionAutomatica();
  
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    console.log(`📡 API disponible en: http://localhost:${PORT}`);
    console.log(`📰 Endpoint principal (JSON con imágenes): http://localhost:${PORT}/daily-news`);
    console.log(`📊 Estadísticas de imágenes: http://localhost:${PORT}/images-stats`);
    console.log(`💾 Estadísticas de Supabase: http://localhost:${PORT}/supabase-stats`);
    console.log(`⚙️  Actualización automática: Cada 2 horas`);
    console.log(`🔄 Cron Job: POST a /force-update`);
  });
}

iniciarServidor(); 