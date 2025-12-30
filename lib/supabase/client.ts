import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a mock client if env vars are missing (for development/testing)
const createSupabaseClient = () => {
    if (!supabaseUrl || !supabaseAnonKey) {
        console.warn('Supabase environment variables not configured. Using mock client.');
        // Return a mock client that won't crash but will show errors on auth attempts
        return {
            auth: {
                signInWithPassword: async () => ({
                    data: { session: null, user: null },
                    error: { message: 'Supabase no está configurado. Por favor configure las variables de entorno.' }
                }),
                signOut: async () => ({ error: null }),
                getSession: async () => ({ data: { session: null }, error: null }),
                onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
            },
        } as any;
    }

    return createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true,
        },
    });
};

export const supabase = createSupabaseClient();
