import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

// TEMP: Hardcoded credentials for testing
const supabaseUrl = 'https://zrjznebxxtlhykyaizaf.supabase.co';
const supabaseAnonKey = 'sb_publishable_trplQLyMWTwlTIKykYzgNA_ubB1y0hY';

export async function createClient() {
    const cookieStore = await cookies();

    return createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value, ...options });
                    } catch (error) {
                        // Server component can't set cookies
                    }
                },
                remove(name: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value: '', ...options });
                    } catch (error) {
                        // Server component can't remove cookies
                    }
                },
            },
        }
    );
}
