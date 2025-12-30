import { createClient } from '@supabase/supabase-js';

// Supabase project credentials
const supabaseUrl = 'https://zrjznebxxtikykaizaf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpyanpuZWJ4eHRpa3lrYWl6YWYiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczNTUzNzE3OSwiZXhwIjoyMDUxMTEzMTc5fQ.wYwxQsghh2NQYqQl9j6wHBAOdKlCHXiVKGFjXL6vqhA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
    },
});
