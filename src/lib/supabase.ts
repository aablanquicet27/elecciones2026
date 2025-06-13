import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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