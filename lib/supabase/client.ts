import { createBrowserClient } from '@supabase/ssr';

// TEMP: Hardcoded credentials for testing
const supabaseUrl = 'https://zrjznebxxtlhykyaizaf.supabase.co';
const supabaseAnonKey = 'sb_publishable_trplQLyMWTwlTIKykYzgNA_ubB1y0hY';

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
