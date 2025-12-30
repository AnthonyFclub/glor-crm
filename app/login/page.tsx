'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
                router.push('/dashboard');
            }
        } catch (err: any) {
            setError(err.message || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style jsx global>{`
                body {
                    margin: 0 !important;
                    padding: 0 !important;
                    background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%) !important;
                    min-height: 100vh !important;
                }
            `}</style>
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100vw',
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                padding: '20px',
                boxSizing: 'border-box',
                fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
                overflow: 'auto'
            }}>
                <div style={{
                    width: '100%',
                    maxWidth: '450px',
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    padding: '48px 40px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    boxSizing: 'border-box'
                }}>
                    {/* Logo */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginBottom: '32px'
                    }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '36px',
                            fontWeight: 'bold'
                        }}>
                            G
                        </div>
                    </div>

                    {/* Title */}
                    <h1 style={{
                        textAlign: 'center',
                        marginBottom: '8px',
                        marginTop: '0',
                        fontSize: '32px',
                        fontWeight: '700',
                        color: '#1f2937'
                    }}>
                        GLOR CRM
                    </h1>
                    <p style={{
                        textAlign: 'center',
                        marginBottom: '32px',
                        marginTop: '0',
                        fontSize: '16px',
                        color: '#6b7280'
                    }}>
                        Bienes Raíces Dashboard
                    </p>

                    {/* Error */}
                    {error && (
                        <div style={{
                            background: '#fef2f2',
                            border: '1px solid #fecaca',
                            borderRadius: '8px',
                            padding: '16px',
                            marginBottom: '24px',
                            color: '#dc2626',
                            fontSize: '14px'
                        }}>
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleLogin}>
                        {/* Email */}
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#374151',
                                marginBottom: '8px'
                            }}>
                                Correo Electrónico
                            </label>
                            <input
                                type="email"
                                placeholder="tu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                required
                                style={{
                                    width: '100%',
                                    padding: '14px 16px',
                                    fontSize: '16px',
                                    border: '2px solid #e5e7eb',
                                    borderRadius: '10px',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                    background: '#f9fafb'
                                }}
                            />
                        </div>

                        {/* Password */}
                        <div style={{ marginBottom: '24px' }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '8px'
                            }}>
                                <label style={{
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    color: '#374151'
                                }}>
                                    Contraseña
                                </label>
                                <button
                                    type="button"
                                    onClick={() => router.push('/recuperar-password')}
                                    style={{
                                        fontSize: '14px',
                                        color: '#2563eb',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontWeight: '500'
                                    }}
                                >
                                    ¿Olvidaste tu contraseña?
                                </button>
                            </div>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                                required
                                style={{
                                    width: '100%',
                                    padding: '14px 16px',
                                    fontSize: '16px',
                                    border: '2px solid #e5e7eb',
                                    borderRadius: '10px',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                    background: '#f9fafb'
                                }}
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '16px',
                                fontSize: '16px',
                                fontWeight: '600',
                                color: 'white',
                                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                                border: 'none',
                                borderRadius: '10px',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.6 : 1,
                                marginTop: '8px'
                            }}
                        >
                            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </button>
                    </form>

                    {/* Footer */}
                    <div style={{
                        marginTop: '32px',
                        paddingTop: '24px',
                        borderTop: '1px solid #e5e7eb',
                        textAlign: 'center'
                    }}>
                        <p style={{ fontSize: '13px', color: '#9ca3af', margin: '0 0 4px 0' }}>
                            © 2025 GLOR Bienes Raíces
                        </p>
                        <p style={{ fontSize: '13px', color: '#9ca3af', margin: '0' }}>
                            Todos los derechos reservados
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
