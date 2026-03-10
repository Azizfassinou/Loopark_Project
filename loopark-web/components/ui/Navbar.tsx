'use client';

import Link from 'next/link';
import { Logo } from './Logo';
import { Button } from './Button';
import { Search, User, LogOut, MapPin } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

export const Navbar = () => {
    const pathname = usePathname();

    const menuItems = [
        { name: 'Rechercher', href: '/app/search', icon: Search },
        { name: 'Je propose', href: '/app/host', icon: MapPin },
        { name: 'Profil', href: '/app/profile', icon: User },
    ];

    return (
        <header className="sticky top-0 z-50 w-full glass border-b border-border-color">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <div className="flex items-center gap-8">
                        <Link href="/app/search" className="hover:opacity-80 transition-opacity">
                            <Logo className="h-10" />
                        </Link>

                        <nav className="hidden md:flex items-center gap-1">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${isActive
                                            ? 'bg-brand-green/10 text-brand-green'
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                            }`}
                                    >
                                        <Icon className="h-4 w-4" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                            onClick={() => signOut({ redirectTo: '/login' })}
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">Déconnexion</span>
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
};
