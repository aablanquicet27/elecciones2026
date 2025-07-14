/**
 * Obtiene y procesa las noticias desde el servidor de Render.
 * Esta única función se encarga de:
 * 1. Conectarse a la URL.
 * 2. Obtener el JSON.
 * 3. Validar los artículos usando el schema que viene en la misma respuesta.
 * 4. Guardar las noticias en Supabase para historial.
 * 5. Devolver un objeto con los datos listos o un error.
 *
 * @returns {Promise<object>} Una promesa que resuelve a un objeto con:
 * - exito (boolean): true si todo fue correcto.
 * - datos (Array): La lista de artículos validados.
 * - error (string|null): Un mensaje de error si algo falló.
 */

import { guardarNoticias, obtenerHistorialNoticias } from '../lib/supabase';

// Definir tipos para mejor manejo de TypeScript
interface Articulo {
  title: string;
  date: string;
  source: string;
  content: string;
  candidates: string[];
  political_parties: string[];
  created_at?: string;
  url_hash?: string;
  [key: string]: any; // Para campos adicionales
}

interface RespuestaAPI {
  success: boolean;
  data?: { // Hacemos opcional por si hay error
    data: {
      articles: Articulo[];
    };
    schema?: {
      properties?: {
        articles?: {
          items?: {
            required?: string[];
          };
        };
      };
    };
  };
  // Añadimos campos que pueden venir en una respuesta de error
  error?: string;
  details?: string;
}

// Definimos una interfaz para la respuesta de nuestra función
interface ResultadoProcesado {
  exito: boolean;
  datos: Articulo[];
  error: string | null;
  statusCode?: number | null; // <-- Incluimos el código de estado
}

// Nueva función optimizada que combina historial + noticias actuales
export async function obtenerTodasLasNoticias(): Promise<ResultadoProcesado> {
  try {
    console.log('🔄 Obteniendo todas las noticias (historial + actuales)...');
    
    // PASO 1: Obtener historial de Supabase
    const historialResult = await obtenerHistorialNoticias(200, 60); // Últimos 60 días, máximo 200 noticias
    let noticiasHistorial: Articulo[] = [];
    
    if (historialResult.success && historialResult.data) {
      noticiasHistorial = historialResult.data.map((item: any) => ({
        title: item.title,
        content: item.content,
        date: item.date,
        source: item.source,
        candidates: item.candidates || [],
        political_parties: item.political_parties || [],
        created_at: item.created_at,
        url_hash: item.url_hash
      }));
      console.log(`📚 Historial cargado: ${noticiasHistorial.length} noticias`);
    }
    
    // PASO 2: Obtener noticias actuales de la API
    const noticiasActuales = await obtenerNoticiasProcesadas();
    let noticiasNuevas: Articulo[] = [];
    
    if (noticiasActuales.exito) {
      noticiasNuevas = noticiasActuales.datos;
      console.log(`🆕 Noticias nuevas obtenidas: ${noticiasNuevas.length} noticias`);
    } else {
      console.warn('⚠️ No se pudieron obtener noticias actuales:', noticiasActuales.error);
    }
    
    // PASO 3: Combinar y eliminar duplicados
    const hashesExistentes = new Set(noticiasHistorial.map(n => n.url_hash).filter(Boolean));
    const noticiasUnicas = new Map<string, Articulo>();
    
    // Agregar noticias del historial
    noticiasHistorial.forEach(noticia => {
      const hash = noticia.url_hash || btoa(noticia.title + noticia.source + noticia.date);
      noticiasUnicas.set(hash, noticia);
    });
    
    // Agregar noticias nuevas (solo si no están en el historial)
    noticiasNuevas.forEach(noticia => {
      const hash = btoa(noticia.title + noticia.source + noticia.date);
      if (!hashesExistentes.has(hash)) {
        noticiasUnicas.set(hash, noticia);
      }
    });
    
    // Convertir a array y ordenar por fecha
    const todasLasNoticias = Array.from(noticiasUnicas.values()).sort((a, b) => {
      const fechaA = new Date(a.created_at || a.date);
      const fechaB = new Date(b.created_at || b.date);
      return fechaB.getTime() - fechaA.getTime();
    });
    
    console.log(`✅ Total de noticias combinadas: ${todasLasNoticias.length}`);
    
    return {
      exito: true,
      datos: todasLasNoticias,
      error: null
    };
    
  } catch (error) {
    console.error('❌ Error obteniendo todas las noticias:', error);
    return {
      exito: false,
      datos: [],
      error: 'Error obteniendo noticias. Intenta de nuevo.',
      statusCode: null
    };
  }
}

export async function obtenerNoticiasProcesadas(): Promise<ResultadoProcesado> {
  const url = 'https://elecciones202.onrender.com/daily-news';

  try {
    console.log('🔄 Obteniendo noticias desde API...');
    
    // --- PASO 1: CONECTAR Y OBTENER EL JSON ---
    const respuestaServidor = await fetch(url);
    
    // Leemos el JSON en cualquier caso, porque puede contener el mensaje de error
    const jsonCompleto: RespuestaAPI = await respuestaServidor.json();

    if (!respuestaServidor.ok) {
      const mensajeServidor = jsonCompleto.error || `Error de red del servidor`;
      console.warn(`Respuesta no exitosa del servidor (${respuestaServidor.status}):`, mensajeServidor);
      
      // Devolvemos una estructura de error enriquecida
      return { 
        exito: false, 
        datos: [], 
        error: mensajeServidor, 
        statusCode: respuestaServidor.status 
      };
    }

    // --- PASO 2: PROCESAR EL JSON Y VALIDAR CON EL SCHEMA ---
    if (!jsonCompleto || !jsonCompleto.success || !jsonCompleto.data?.data?.articles) {
      throw new Error("La respuesta de la API es inválida o no contiene la estructura esperada.");
    }

    const articulosCrudos: Articulo[] = jsonCompleto.data.data.articles;
    const schema = jsonCompleto.data.schema;
    const camposRequeridos: string[] | undefined = schema?.properties?.articles?.items?.required;

    // Si no hay schema o campos requeridos, devolver todos los artículos sin filtrar
    if (!camposRequeridos || camposRequeridos.length === 0) {
      console.warn("No se encontró un schema para validar. Se devolverán todos los artículos sin filtrar.");
      
      // Guardar en Supabase antes de devolver
      if (articulosCrudos.length > 0) {
        try {
          const resultado = await guardarNoticias(articulosCrudos);
          if (resultado.success) {
            console.log('✅ Noticias guardadas en Supabase exitosamente');
          } else {
            console.warn('⚠️ Error guardando en Supabase:', resultado.error);
          }
        } catch (dbError) {
          console.warn('⚠️ Error guardando en Supabase:', dbError);
          // No interrumpimos el flujo por error de guardado
        }
      }
      
      return { exito: true, datos: articulosCrudos, error: null };
    }
    
    // Validar artículos con el schema
    const articulosValidados = articulosCrudos.filter((articulo: Articulo) => {
      // Valida que cada artículo tenga todos los campos requeridos por el schema.
      const esValido = camposRequeridos.every((campo: string) => {
        const tienePropiedad = articulo.hasOwnProperty(campo);
        const valorNoEsNulo = articulo[campo] !== null && articulo[campo] !== undefined;
        
        // Para arrays, verificar que no esté vacío si es requerido
        if (Array.isArray(articulo[campo])) {
          return tienePropiedad && valorNoEsNulo;
        }
        
        // Para strings, verificar que no esté vacío
        if (typeof articulo[campo] === 'string') {
          return tienePropiedad && valorNoEsNulo && articulo[campo].trim() !== '';
        }
        
        return tienePropiedad && valorNoEsNulo;
      });
      
      if (!esValido) {
        console.warn('Artículo descartado por no cumplir schema:', {
          titulo: articulo.title || 'Sin título',
          camposFaltantes: camposRequeridos.filter(campo => !articulo.hasOwnProperty(campo) || articulo[campo] === null || articulo[campo] === undefined)
        });
      }
      
      return esValido;
    });

    console.log(`Artículos procesados: ${articulosCrudos.length} recibidos, ${articulosValidados.length} validados`);

    // --- PASO 3: GUARDAR EN SUPABASE ---
    if (articulosValidados.length > 0) {
      try {
        const resultado = await guardarNoticias(articulosValidados);
        if (resultado.success) {
          console.log(`✅ ${articulosValidados.length} noticias guardadas en Supabase exitosamente`);
        } else {
          console.warn('⚠️ Error guardando noticias en Supabase:', resultado.error);
        }
      } catch (dbError) {
        console.warn('⚠️ Error de conexión con Supabase:', dbError);
        // No interrumpimos el flujo por error de guardado
      }
    }

    // --- PASO 4: DEVOLVER EL RESULTADO FINAL ---
    return {
      exito: true,
      datos: articulosValidados,
      error: null
    };

  } catch (err: unknown) {
    // --- MANEJO DE CUALQUIER ERROR DE RED O PARSEO ---
    const mensajeError = err instanceof Error ? err.message : String(err);
    console.error("Falló la conexión o el parseo de noticias:", err);
    return {
      exito: false,
      datos: [],
      error: "No se pudo conectar con el servidor de noticias. Revisa tu conexión a internet.",
      statusCode: null // No hay código de estado en este tipo de error
    };
  }
}
