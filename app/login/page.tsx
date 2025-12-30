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
        <html>
            <head>
                <title>Login - GLOR CRM</title>
                <style>{`
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    .login-page {
                        min-height: 100vh;
                        width: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
                        padding: 20px;
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    }
                    .login-card {
                        width: 100%;
                        max-width: 450px;
                        background: white;
                        border-radius: 16px;
                        padding: 48px 40px;
                        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                    }
                    .logo-container {
                        display: flex;
                        justify-content: center;
                        margin-bottom: 32px;
                    }
                    .logo {
                        width: 80px;
                        height: 80px;
                        background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
                        border-radius: 16px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        font-size: 36px;
                        font-weight: bold;
                    }
                    .title {
                        text-align: center;
                        margin-bottom: 8px;
                        font-size: 32px;
                        font-weight: 700;
                        color: #1f2937;
                    }
                    .subtitle {
                        text-align: center;
                        margin-bottom: 32px;
                        font-size: 16px;
                        color: #6b7280;
                    }
                    .error-box {
                        background: #fef2f2;
                        border: 1px solid #fecaca;
                        border-radius: 8px;
                        padding: 16px;
                        margin-bottom: 24px;
                        color: #dc2626;
                        font-size: 14px;
                    }
                    .form-group {
                        margin-bottom: 24px;
                    }
                    .label {
                        display: block;
                        font-size: 14px;
                        font-weight: 600;
                        color: #374151;
                        margin-bottom: 8px;
                    }
                    .input {
                        width: 100%;
                        padding: 14px 16px;
                        font-size: 16px;
                        border: 2px solid #e5e7eb;
                        border-radius: 10px;
                        outline: none;
                        transition: border-color 0.2s, box-shadow 0.2s;
                        background: #f9fafb;
                    }
                    .input:focus {
                        border-color: #2563eb;
                        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
                        background: white;
                    }
                    .input:disabled {
                        opacity: 0.6;
                        cursor: not-allowed;
                    }
                    .password-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 8px;
                    }
                    .forgot-link {
                        font-size: 14px;
                        color: #2563eb;
                        text-decoration: none;
                        font-weight: 500;
                        cursor: pointer;
                        background: none;
                        border: none;
                    }
                    .forgot-link:hover {
                        color: #1d4ed8;
                        text-decoration: underline;
                    }
                    .submit-btn {
                        width: 100%;
                        padding: 16px;
                        font-size: 16px;
                        font-weight: 600;
                        color: white;
                        background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
                        border: none;
                        border-radius: 10px;
                        cursor: pointer;
                        transition: transform 0.2s, box-shadow 0.2s;
                        margin-top: 8px;
                    }
                    .submit-btn:hover:not(:disabled) {
                        transform: translateY(-2px);
                        box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.4);
                    }
                    .submit-btn:disabled {
                        opacity: 0.6;
                        cursor: not-allowed;
                    }
                    .spinner {
                        display: inline-block;
                        width: 20px;
                        height: 20px;
                        border: 2px solid rgba(255,255,255,0.3);
                        border-radius: 50%;
                        border-top-color: white;
                        animation: spin 1s linear infinite;
                        margin-right: 10px;
                        vertical-align: middle;
                    }
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                    .footer {
                        margin-top: 32px;
                        padding-top: 24px;
                        border-top: 1px solid #e5e7eb;
                        text-align: center;
                    }
                    .footer p {
                        font-size: 13px;
                        color: #9ca3af;
                        margin-bottom: 4px;
                    }
                    @media (max-width: 480px) {
                        .login-card {
                            padding: 32px 24px;
                        }
                        .logo {
                            width: 64px;
                            height: 64px;
                            font-size: 28px;
                        }
                        .title {
                            font-size: 26px;
                        }
                    }
                `}</style>
            </head>
            <body>
                <div className="login-page">
                    <div className="login-card">
                        {/* Logo */}
                        <div className="logo-container">
                            <div className="logo">G</div>
                        </div>

                        {/* Title */}
                        <h1 className="title">GLOR CRM</h1>
                        <p className="subtitle">Bienes Raíces Dashboard</p>

                        {/* Error */}
                        {error && (
                            <div className="error-box">{error}</div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleLogin}>
                            {/* Email */}
                            <div className="form-group">
                                <label className="label" htmlFor="email">
                                    Correo Electrónico
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    className="input"
                                    placeholder="tu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading}
                                    required
                                />
                            </div>

                            {/* Password */}
                            <div className="form-group">
                                <div className="password-header">
                                    <label className="label" htmlFor="password" style={{ marginBottom: 0 }}>
                                        Contraseña
                                    </label>
                                    <button
                                        type="button"
                                        className="forgot-link"
                                        onClick={() => router.push('/recuperar-password')}
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </button>
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    className="input"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                    required
                                />
                            </div>

                            {/* Submit */}
                            <button type="submit" className="submit-btn" disabled={loading}>
                                {loading ? (
                                    <>
                                        <span className="spinner"></span>
                                        Iniciando sesión...
                                    </>
                                ) : (
                                    'Iniciar Sesión'
                                )}
                            </button>
                        </form>

                        {/* Footer */}
                        <div className="footer">
                            <p>© 2025 GLOR Bienes Raíces</p>
                            <p>Todos los derechos reservados</p>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
}
