'use client';

import { Bell, Plus, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function Header() {
    const [user, setUser] = useState<any>(null);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        // Get current user
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
        });

        // Get unread notifications count
        if (user) {
            supabase
                .from('notifications')
                .select('id', { count: 'exact', head: true })
                .eq('user_id', user.id)
                .eq('leida', false)
                .then(({ count }) => {
                    setUnreadCount(count || 0);
                });
        }
    }, [user]);

    return (
        <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6 sticky top-0 z-40">
            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
                    <input
                        type="text"
                        placeholder="Buscar contactos, propiedades, deals..."
                        className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    />
                </div>
            </div>

            {/* Quick Actions & Notifications */}
            <div className="flex items-center gap-4">
                {/* Quick Add Button */}
                <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all font-medium shadow-md hover:shadow-lg">
                    <Plus className="h-5 w-5" />
                    <span className="hidden sm:inline">Nuevo</span>
                </button>

                {/* Notifications */}
                <button className="relative p-2 hover:bg-background rounded-lg transition-all">
                    <Bell className="h-6 w-6 text-foreground" />
                    {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 h-5 w-5 bg-danger text-white text-xs font-bold rounded-full flex items-center justify-center">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </button>

                {/* User Avatar */}
                <div className="flex items-center gap-3 pl-4 border-l border-border">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-semibold text-foreground">
                            {user?.email?.split('@')[0] || 'Usuario'}
                        </p>
                        <p className="text-xs text-muted">Admin</p>
                    </div>
                    <div className="h-10 w-10 bg-gradient-to-br from-primary-600 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                        {user?.email?.[0].toUpperCase() || 'U'}
                    </div>
                </div>
            </div>
        </header>
    );
}
