'use client';

import Link from 'next/link';
import { Logo } from './Logo';
import { Search, User, MapPin, LogOut, Shield } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { ThemeToggle } from './ThemeToggle';

export const Navbar = () => {
    const pathname = usePathname();
    const { data: session } = useSession();
    const isAdmin = session?.user?.role === 'ADMIN';

    const menuItems = [
        { name: 'Rechercher', href: '/app/search', icon: Search },
        { name: 'Je propose', href: '/app/host', icon: MapPin },
        { name: 'Profil', href: '/app/profile', icon: User },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--background)]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="flex justify-between items-center h-14">
                    <div className="flex items-center gap-8">
                        <Link href="/app/search">
                            <Logo />
                        </Link>
                        <nav className="hidden md:flex items-center gap-1">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${isActive
                                            ? 'text-[var(--foreground)] font-medium bg-[var(--surface)]'
                                            : 'text-[var(--muted)] hover:text-[var(--foreground)]'
                                            }`}
                                    >
                                        <Icon className="h-4 w-4" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="flex items-center gap-2">
                        <ThemeToggle />

                        {isAdmin && (
                            <Link
                                href="/admin"
                                className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-[var(--muted)] hover:text-[var(--foreground)] border border-[var(--border)] px-3 py-1.5 rounded-md transition-colors"
                            >
                                <Shield className="h-3.5 w-3.5" />
                                Admin
                            </Link>
                        )}

                        <button
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors rounded-md"
                        >
                            <LogOut className="h-4 w-4" />
                            <span className="hidden sm:inline">Déconnexion</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};
