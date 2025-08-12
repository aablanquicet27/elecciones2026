import { supabase } from '../lib/supabase';

// Interfaz para las noticias de la base de datos
interface Noticia {
  id: number;
  title: string;
  content: string;
  date: string;
  source: string;
  candidates: string[];
  political_parties: string[];
  created_at: string;
  url_hash: string;
}

interface ResultadoNoticias {
  exito: boolean;
  datos: Noticia[];
  error: string | null;
  totalCount?: number;
  hasMore?: boolean;
}

/**
 * Obtiene noticias directamente de la tabla noticias_historial en Supabase
 * @param limite - Número de noticias a obtener (default: 50)
 * @param offset - Desplazamiento para paginación (default: 0)
 * @returns Promesa con las noticias o error
 */
export async function obtenerTodasLasNoticias(
  limite: number = 50, 
  offset: number = 0
): Promise<ResultadoNoticias> {
  try {
    console.log(`🔄 Obteniendo noticias desde Supabase (límite: ${limite}, offset: ${offset})...`);
    
    // Obtener el total de registros para saber si hay más
    const { count } = await supabase
      .from('noticias_historial')
      .select('*', { count: 'exact', head: true });

    // Obtener las noticias con paginación
    const { data, error } = await supabase
      .from('noticias_historial')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limite - 1);

    if (error) {
      console.error('❌ Error de Supabase:', error);
      throw new Error(`Error de base de datos: ${error.message}`);
    }

    if (!data) {
      console.warn('⚠️ No se obtuvieron datos de Supabase');
      return {
        exito: true,
        datos: [],
        error: null,
        totalCount: 0,
        hasMore: false
      };
    }

    const noticias: Noticia[] = data.map((item: any) => ({
      id: item.id,
      title: item.title || 'Título no disponible',
      content: item.content || 'Contenido no disponible',
      date: item.date || item.created_at,
      source: item.source || 'Fuente no especificada',
      candidates: Array.isArray(item.candidates) ? item.candidates : [],
      political_parties: Array.isArray(item.political_parties) ? item.political_parties : [],
      created_at: item.created_at,
      url_hash: item.url_hash || ''
    }));

    const totalCount = count || 0;
    const hasMore = (offset + limite) < totalCount;

    console.log(`✅ Noticias obtenidas: ${noticias.length} de ${totalCount} total`);
    console.log(`📄 ¿Hay más páginas? ${hasMore}`);

    return {
      exito: true,
      datos: noticias,
      error: null,
      totalCount,
      hasMore
    };

  } catch (error) {
    console.error('❌ Error obteniendo noticias:', error);
    return {
      exito: false,
      datos: [],
      error: error instanceof Error ? error.message : 'Error desconocido obteniendo noticias',
      totalCount: 0,
      hasMore: false
    };
  }
}

/**
 * Función para agregar manualmente una noticia a la base de datos
 * @param noticia - Datos de la noticia a agregar
 * @returns Promesa con el resultado de la operación
 */
export async function agregarNoticiaManual(noticia: {
  title: string;
  content: string;
  date: string;
  source: string;
  candidates?: string[];
  political_parties?: string[];
}) {
  try {
    console.log('📝 Agregando noticia manual:', noticia.title);
    
    const noticiaParaGuardar = {
      title: noticia.title,
      content: noticia.content,
      date: noticia.date,
      source: noticia.source,
      candidates: noticia.candidates || [],
      political_parties: noticia.political_parties || [],
      url_hash: btoa(noticia.title + noticia.source + noticia.date + Date.now()) // Hash único
    };

    const { data, error } = await supabase
      .from('noticias_historial')
      .insert([noticiaParaGuardar])
      .select();

    if (error) {
      console.error('❌ Error agregando noticia manual:', error);
      throw new Error(`Error de base de datos: ${error.message}`);
    }

    console.log('✅ Noticia manual agregada exitosamente');
    return {
      exito: true,
      datos: data,
      error: null
    };

  } catch (error) {
    console.error('❌ Error agregando noticia manual:', error);
    return {
      exito: false,
      datos: null,
      error: error instanceof Error ? error.message : 'Error desconocido agregando noticia'
    };
  }
}

/**
 * Función para obtener estadísticas rápidas de las noticias
 */
export async function obtenerEstadisticasNoticias() {
  try {
    const { data, error } = await supabase
      .from('noticias_historial')
      .select('source, candidates, political_parties');

    if (error) throw error;

    const stats = {
      totalNoticias: data?.length || 0,
      fuentesUnicas: [...new Set(data?.map((n: any) => n.source))].length,
      candidatosUnicos: [...new Set(data?.flatMap((n: any) => n.candidates || []))].length,
      partidosUnicos: [...new Set(data?.flatMap((n: any) => n.political_parties || []))].length
    };

    return { success: true, data: stats };
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    return { success: false, error };
  }
}
