'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function RecuperarPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (resetError) throw resetError;

            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Error al enviar el correo de recuperación');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
            </div>

            {/* Recovery Card */}
            <div className="relative z-10 w-full max-w-md px-6">
                <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
                    {/* Logo & Title */}
                    <div className="text-center space-y-2">
                        <div className="flex items-center justify-center mb-4">
                            <div className="h-16 w-16 bg-gradient-to-br from-primary-800 to-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                                G
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-primary-800">Recuperar Contraseña</h1>
                        <p className="text-sm text-muted">
                            Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
                        </p>
                    </div>

                    {/* Success Message */}
                    {success && (
                        <div className="bg-success/10 border border-success/30 text-success rounded-lg p-4 text-sm">
                            <p className="font-medium">¡Correo enviado!</p>
                            <p className="mt-1">Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.</p>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="bg-danger/10 border border-danger/30 text-danger rounded-lg p-3 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Recovery Form */}
                    {!success && (
                        <form onSubmit={handleResetPassword} className="space-y-6">
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

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-primary-800 to-primary-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-primary-900 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                            >
                                {loading ? 'Enviando...' : 'Enviar Enlace de Recuperación'}
                            </button>
                        </form>
                    )}

                    {/* Back to Login */}
                    <div className="text-center">
                        <button
                            onClick={() => router.push('/login')}
                            className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
                        >
                            ← Volver al inicio de sesión
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
