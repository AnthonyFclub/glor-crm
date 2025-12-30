import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// Supabase project credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Create a response
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    // Create Supabase client
    const supabase = createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value;
                },
                set(name: string, value: string, options: any) {
                    request.cookies.set({ name, value, ...options });
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    response.cookies.set({ name, value, ...options });
                },
                remove(name: string, options: any) {
                    request.cookies.set({ name, value: '', ...options });
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    response.cookies.set({ name, value: '', ...options });
                },
            },
        }
    );

    // Get session
    const {
        data: { session },
    } = await supabase.auth.getSession();

    // Protected routes
    const protectedRoutes = [
        '/dashboard',
        '/contactos',
        '/actividades',
        '/pipeline',
        '/propiedades',
        '/emails',
        '/reportes',
        '/configuracion',
    ];

    const isProtectedRoute = protectedRoutes.some((route) =>
        pathname.startsWith(route)
    );

    // Redirect to login if trying to access protected route without session
    if (isProtectedRoute && !session) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Redirect to dashboard if trying to access login with active session
    if (pathname === '/login' && session) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Redirect root to dashboard if logged in, otherwise to login
    if (pathname === '/') {
        if (session) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        } else {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return response;
}

export const config = {
    matcher: [
        '/',
        '/login',
        '/recuperar-password',
        '/dashboard/:path*',
        '/contactos/:path*',
        '/actividades/:path*',
        '/pipeline/:path*',
        '/propiedades/:path*',
        '/emails/:path*',
        '/reportes/:path*',
        '/configuracion/:path*',
    ],
};
