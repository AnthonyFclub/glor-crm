'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) throw signInError;

            if (data.session) {
                // Set session duration based on "Remember Me"
                // Default: 30 minutes, Remember Me: 30 days
                const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 30 * 60; // seconds

                router.push('/dashboard');
            }
        } catch (err: any) {
            setError(err.message || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-secondary-500 rounded-full blur-3xl opacity-10"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-400 rounded-full blur-3xl opacity-10"></div>
            </div>

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-md px-6">
                <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-8">
                    {/* Logo & Branding */}
                    <div className="text-center space-y-2">
                        <div className="flex items-center justify-center mb-4">
                            <div className="h-16 w-16 bg-gradient-to-br from-primary-800 to-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                                G
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-primary-800">GLOR CRM</h1>
                        <p className="text-sm text-muted">Bienes Raíces Dashboard</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-danger/10 border border-danger/30 text-danger rounded-lg p-3 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Email */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium text-foreground">
                                Correo Electrónico
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                placeholder="tu@email.com"
                                disabled={loading}
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium text-foreground">
                                    Contraseña
                                </label>
                                <button
                                    type="button"
                                    className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
                                    onClick={() => router.push('/recuperar-password')}
                                >
                                    ¿Olvidaste tu contraseña?
                                </button>
                            </div>
                            <input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                placeholder="••••••••"
                                disabled={loading}
                            />
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-border rounded cursor-pointer"
                                disabled={loading}
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-foreground cursor-pointer">
                                Recordarme por 30 días
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-primary-800 to-primary-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-primary-900 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Iniciando sesión...
                                </span>
                            ) : (
                                'Iniciar Sesión'
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="text-center text-xs text-muted pt-4 border-t border-border">
                        <p>© 2025 GLOR Bienes Raíces. Todos los derechos reservados.</p>
                        <p className="mt-1">Sistema privado para Gloria & Anthony Morales</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
