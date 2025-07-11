import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para noticias
interface NoticiaHistorial {
  id?: number;
  title: string;
  content: string;
  date: string;
  source: string;
  candidates: string[];
  political_parties: string[];
  created_at?: string;
  url_hash?: string;
}

// ====== FUNCIONES PARA HISTORIAL DE NOTICIAS ======

// Función para guardar noticias en el historial
export const guardarNoticias = async (noticias: NoticiaHistorial[]) => {
  try {
    const noticiasParaGuardar = noticias.map(noticia => ({
      title: noticia.title,
      content: noticia.content,
      date: noticia.date,
      source: noticia.source,
      candidates: noticia.candidates || [],
      political_parties: noticia.political_parties || [],
      url_hash: btoa(noticia.title + noticia.source + noticia.date) // Hash simple para evitar duplicados
    }));

    const { data, error } = await supabase
      .from('noticias_historial')
      .upsert(noticiasParaGuardar, { 
        onConflict: 'url_hash',
        ignoreDuplicates: true 
      })
      .select();

    if (error) throw error;
    return { success: true, data, error: null };
  } catch (error) {
    console.error('Error guardando noticias:', error);
    return { success: false, data: null, error };
  }
};

// Función para obtener historial de noticias
export const obtenerHistorialNoticias = async (limite: number = 50, dias: number = 30) => {
  try {
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - dias);

    const { data, error } = await supabase
      .from('noticias_historial')
      .select('*')
      .gte('created_at', fechaLimite.toISOString())
      .order('created_at', { ascending: false })
      .limit(limite);

    if (error) throw error;
    return { success: true, data: data || [], error: null };
  } catch (error) {
    console.error('Error obteniendo historial:', error);
    return { success: false, data: [], error };
  }
};

// Función para obtener estadísticas de noticias
export const obtenerEstadisticasNoticias = async () => {
  try {
    const { data, error } = await supabase
      .from('noticias_historial')
      .select('source, candidates, political_parties, date')
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    if (error) throw error;
    
    const stats = {
      totalNoticias: data?.length || 0,
      fuentesUnicas: [...new Set(data?.map((n: any) => n.source))].length,
      candidatosMencionados: [...new Set(data?.flatMap((n: any) => n.candidates || []))].length,
      partidosMencionados: [...new Set(data?.flatMap((n: any) => n.political_parties || []))].length
    };

    return { success: true, data: stats, error: null };
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    return { success: false, data: null, error };
  }
};

// Función para verificar suscripción
export const checkSubscription = async (email: string) => {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('email, active')
    .eq('email', email)
    .single();

  return { data, error };
};

// Función para crear suscripción
export const createSubscription = async (email: string) => {
  const { data, error } = await supabase
    .from('subscriptions')
    .insert([{ email, active: true }])
    .select()
    .single();

  return { data, error };
};

// Función para registrar voto
export const recordVote = async (email: string, candidate: string, ipAddress?: string) => {
  const { data, error } = await supabase
    .from('votes')
    .insert([{ 
      email, 
      candidate, 
      ip_address: ipAddress 
    }])
    .select()
    .single();

  return { data, error };
};

// Función para verificar si ya votó
export const checkIfVoted = async (email: string) => {
  const { data, error } = await supabase
    .from('votes')
    .select('email')
    .eq('email', email)
    .single();

  return { hasVoted: !!data, error };
};