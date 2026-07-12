'use client';

import { Navbar } from "@/components/ui/Navbar";
import Link from "next/link";
import { Search, MapPin, UserCircle } from "lucide-react";
import { usePathname } from "next/navigation";

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const navItems = [
        { href: '/app/search', label: 'Spots', icon: Search },
        { href: '/app/host', label: 'Hôte', icon: MapPin },
        { href: '/app/profile', label: 'Profil', icon: UserCircle },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-[var(--background)]">
            <Navbar />
            <main className="flex-1 pb-20 md:pb-0">
                {children}
            </main>

            {/* Mobile bottom nav */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-[var(--border)] bg-[var(--background)]/95 backdrop-blur-sm px-4 py-1 flex justify-around items-center z-50 safe-area-inset-bottom">
                {navItems.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex flex-col items-center gap-1 min-w-[60px] py-2 px-3 rounded-lg transition-colors ${isActive
                                ? 'text-brand-green'
                                : 'text-[var(--muted)] hover:text-[var(--foreground)]'
                                }`}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
                            <span className="text-[10px] font-medium">{label}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
