import { createClient } from '@supabase/supabase-js';

// Supabase project credentials
const supabaseUrl = 'https://zrjznebxxtlhykyaizaf.supabase.co';
const supabaseAnonKey = 'sb_publishable_trplQLyMWTwlTIKykYzgNA_ubB1y0hY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
    },
});
