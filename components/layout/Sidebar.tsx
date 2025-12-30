'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    Home,
    Users,
    TrendingUp,
    Building2,
    ClipboardList,
    Mail,
    BarChart3,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Contactos', href: '/contactos', icon: Users },
    { name: 'Pipeline', href: '/pipeline', icon: TrendingUp },
    { name: 'Propiedades', href: '/propiedades', icon: Building2 },
    { name: 'Actividades', href: '/actividades', icon: ClipboardList },
    { name: 'Emails', href: '/emails', icon: Mail },
    { name: 'Reportes', href: '/reportes', icon: BarChart3 },
    { name: 'Configuración', href: '/configuracion', icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [collapsed, setCollapsed] = useState(false);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    return (
        <aside
            className={`fixed top-0 left-0 h-full bg-primary-800 text-white transition-all duration-300 z-50 flex flex-col ${collapsed ? 'w-20' : 'w-64'
                }`}
        >
            {/* Logo */}
            <div className="p-6 border-b border-primary-700">
                <div className="flex items-center justify-between">
                    {!collapsed && (
                        <div>
                            <h1 className="text-xl font-bold text-white">GLOR CRM</h1>
                            <p className="text-xs text-primary-300 mt-1">Bienes Raíces</p>
                        </div>
                    )}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="p-2 hover:bg-primary-700 rounded-lg transition-colors ml-auto"
                    >
                        {collapsed ? (
                            <ChevronRight className="h-5 w-5" />
                        ) : (
                            <ChevronLeft className="h-5 w-5" />
                        )}
                    </button>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                {navigation.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all group relative ${isActive
                                    ? 'bg-secondary-500 text-primary-900 font-semibold shadow-lg'
                                    : 'hover:bg-primary-700 text-primary-100'
                                }`}
                        >
                            <Icon className={`h-5 w-5 ${isActive ? 'text-primary-900' : 'text-primary-300 group-hover:text-white'}`} />
                            {!collapsed && <span>{item.name}</span>}

                            {/* Tooltip for collapsed state */}
                            {collapsed && (
                                <div className="absolute left-full ml-2 px-3 py-2 bg-primary-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap shadow-xl">
                                    {item.name}
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User Section */}
            <div className="p-4 border-t border-primary-700">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary-700 transition-all w-full text-left group"
                >
                    <LogOut className="h-5 w-5 text-primary-300 group-hover:text-white" />
                    {!collapsed && <span className="text-primary-100">Cerrar Sesión</span>}
                </button>
            </div>
        </aside>
    );
}
