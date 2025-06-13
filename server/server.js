import express from 'express';
import cors from 'cors';
import Exa from 'exa-js';
import { OpenAI } from 'openai';
import { promises as fs } from 'fs';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;
const CACHE_FILE_PATH = path.join(path.dirname(new URL(import.meta.url).pathname), 'cache.json');

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

// --- INICIO: FUNCIONES DE CACHÉ ---
async function guardarNoticiasEnCache() {
  try {
    await fs.writeFile(CACHE_FILE_PATH, JSON.stringify(ultimasNoticias, null, 2));
    console.log('💾 Cache de noticias guardado en archivo.');
  } catch (error) {
    console.error('❌ Error al guardar el cache en archivo:', error);
  }
}

async function cargarNoticiasDesdeCache() {
  try {
    const data = await fs.readFile(CACHE_FILE_PATH, 'utf-8');
    ultimasNoticias = JSON.parse(data);
    console.log('✅ Cache de noticias cargado desde archivo.');
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('ℹ️ No se encontró archivo de cache. Se creará uno en la primera actualización.');
    } else {
      console.error('❌ Error al cargar el cache desde archivo:', error);
    }
  }
}
// --- FIN: FUNCIONES DE CACHÉ ---

// --- FUNCIÓN PRINCIPAL CON SCHEMA ---
async function actualizarNoticiasConResearchTask() {
  try {
    console.log('🔄 Iniciando actualización ESTRUCTURADA con imágenes...');
    ultimasNoticias.status = 'updating';
    
    // Obtiene la fecha actual en el formato que espera la instrucción (ej: 8/6/2025)
    const today = new Date().toLocaleDateString('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const currentTime = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
    
    // INSTRUCCIONES MEJORADAS PARA INCLUIR IMÁGENES
    const instructions = `ENCUENTRA TODAS LAS NOTICIAS RELACIONADAS CON LAS ELECCIONES DE COLOMBIA DE 2026 del ${today} a las ${currentTime}. 
    
    INSTRUCCIONES ESPECÍFICAS:
    - Incluye información sobre precandidatos, partidos políticos, encuestas, y cualquier desarrollo electoral relevante
    - IMPORTANTE: Para cada noticia, busca e incluye imágenes cuando estén disponibles (fotos de candidatos, eventos, infografías, etc.)
    - Prioriza noticias con contenido visual rico
    - Incluye noticias de las últimas 2 horas si están disponibles, o las más recientes del día
    - Responde en español
    - Asegúrate de incluir las URLs de las imágenes y descripciones alternativas`;

    // Crear tarea de investigación con configuración para obtener contenido rico
    const { id: taskId } = await exa.research.createTask({
      instructions: instructions,
      output: {
        schema: noticiasSchema,
        inferSchema: false
      },
      // CONFIGURACIÓN ADICIONAL PARA CONTENIDO MULTIMEDIA
      includeContent: true,
      includeImages: true, // Si esta opción está disponible en tu versión de Exa
    });

    // Esperar y obtener resultado
    const task = await exa.research.pollTask(taskId);

    // Guardar las noticias actualizadas
    ultimasNoticias = {
      data: task,
      lastUpdate: new Date().toISOString(),
      status: 'completed',
      date: today,
      time: currentTime,
      taskId: taskId,
      updateType: 'external-cron' // Cambiado para reflejar el origen
    };

    await guardarNoticiasEnCache(); // Guardar en archivo

    console.log(`✅ Noticias con imágenes actualizadas exitosamente: ${new Date().toLocaleString('es-CO')}`);
    console.log(`📊 Total noticias encontradas: ${task?.data?.articles?.length || 0}`);
    
  } catch (error) {
    console.error('❌ Error en actualización con imágenes:', error.message);
    ultimasNoticias.status = 'error';
    ultimasNoticias.lastError = error.message;
    await guardarNoticiasEnCache(); // Guardar también en caso de error
  }
}

// --- ENDPOINTS DE LA API ---

// Endpoint raíz que muestra el estado y los endpoints disponibles
app.get('/', (req, res) => {
  res.json({ 
    message: 'API de Noticias Colombia 2026 con imágenes - Persistencia en Archivo',
    status: 'active',
    cronJob: {
      active: false, // El cron job ya no se gestiona aquí
      recommendation: 'Usar Cron Job de Render apuntando a /force-update',
      schedule: 'Configurar en Render como `0 */2 * * *`',
      timezone: 'UTC (Render default)',
      lastUpdate: ultimasNoticias.lastUpdate,
      cacheStatus: ultimasNoticias.status,
    },
    features: [
      '📰 Noticias estructuradas con JSON Schema',
      '🖼️ Imágenes incluidas cuando están disponibles',
      '⏰ Actualización mediante endpoint para cron externo',
      '🇨🇴 Zona horaria Colombia para la búsqueda',
      '💾 Sistema de caché basado en archivo JSON'
    ],
    endpoints: [
      'GET / - Estado de la API',
      'GET /daily-news - Noticias con imágenes (formato estructurado)',
      'GET /daily-news-chat - Noticias del día (formato texto)',
      'POST /force-update - Forzar actualización manual',
      'GET /cache-status - Ver el estado del caché interno',
      'GET /images-stats - Estadísticas de imágenes encontradas'
    ]
  });
});

// Endpoint principal para obtener las noticias diarias estructuradas
app.get('/daily-news', async (req, res) => {
  try {
    const today = new Date().toLocaleDateString('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' });
    
    // Si el servidor acaba de iniciar y no hay datos, intentar una actualización
    if (!ultimasNoticias.data) {
      console.log('ℹ️ No hay datos en memoria, forzando primera actualización...');
      await actualizarNoticiasConResearchTask();
    } else {
      // Comprobar si los datos tienen más de 2 horas
      const needsUpdate = !ultimasNoticias.lastUpdate ||
                         (Date.now() - new Date(ultimasNoticias.lastUpdate).getTime()) > (2 * 60 * 60 * 1000);

      if (needsUpdate) {
        console.log('🔄 Datos en caché tienen más de 2 horas. Se recomienda una actualización vía /force-update.');
        // Opcional: podrías auto-actualizar aquí, pero es mejor que lo controle el cron
        // await actualizarNoticiasConResearchTask();
      }
    }

    if (ultimasNoticias.status === 'completed') {
      res.json({
        success: true,
        message: "Noticias con imágenes obtenidas exitosamente",
        cached: true, // Se asume que siempre se sirve de caché
        update_frequency: "external-cron-every-2-hours",
        ...ultimasNoticias
      });
    } else {
      throw new Error(ultimasNoticias.lastError || 'Error desconocido durante la actualización');
    }

  } catch (error) {
    console.error('Error en GET /daily-news:', error);
    res.status(500).json({ 
      success: false, 
      error: "Error al obtener las noticias con imágenes", 
      details: error.message 
    });
  }
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

// Endpoint para ver el estado del cache
app.get('/cache-status', (req, res) => {
  res.json({
    success: true,
    serverTime: new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' }),
    cache: ultimasNoticias
  });
});

// NUEVO ENDPOINT para estadísticas de imágenes
app.get('/images-stats', (req, res) => {
  try {
    if (!ultimasNoticias.data || !ultimasNoticias.data.data || !ultimasNoticias.data.data.articles) {
      return res.json({
        success: true,
        message: "No hay datos disponibles",
        stats: { total: 0, with_images: 0, without_images: 0 }
      });
    }

    const articles = ultimasNoticias.data.data.articles;
    const totalArticles = articles.length;
    const withImages = articles.filter(article => article.image_url && article.image_url.trim() !== '').length;
    const withoutImages = totalArticles - withImages;

    res.json({
      success: true,
      stats: {
        total_articles: totalArticles,
        articles_with_images: withImages,
        articles_without_images: withoutImages,
        image_coverage_percentage: totalArticles > 0 ? ((withImages / totalArticles) * 100).toFixed(2) : 0
      },
      last_update: ultimasNoticias.lastUpdate,
      sample_images: articles
        .filter(article => article.image_url)
        .slice(0, 3)
        .map(article => ({
          title: article.title,
          image_url: article.image_url,
          image_alt: article.image_alt
        }))
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: "Error al obtener estadísticas de imágenes", 
      details: error.message 
    });
  }
});

// Endpoint para forzar una actualización manual (útil para pruebas y para el Cron Job de Render)
app.post('/force-update', async (req, res) => {
  try {
    console.log(`🔄 Actualización manual/externa solicitada...`);
    await actualizarNoticiasConResearchTask();
    res.json({
      success: true,
      message: `Actualización manual completada`,
      data: ultimasNoticias,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error en actualización manual', details: error.message });
  }
});

// Manejo de errores global
app.use((error, req, res, next) => {
  console.error('Error no manejado:', error);
  res.status(500).json({ success: false, error: "Error interno del servidor", details: error.message });
});

// Iniciar servidor
async function iniciarServidor() {
  await cargarNoticiasDesdeCache();
  
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    console.log(`📡 API disponible en: http://localhost:${PORT}`);
    console.log(`📰 Endpoint principal (JSON con imágenes): http://localhost:${PORT}/daily-news`);
    console.log(`📊 Estadísticas de imágenes: http://localhost:${PORT}/images-stats`);
    console.log(`⚙️ Para actualizar, envía una petición POST a /force-update.`);
  });
}

iniciarServidor(); 