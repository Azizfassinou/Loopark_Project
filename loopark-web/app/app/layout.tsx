import { Navbar } from "@/components/ui/Navbar";
import Link from "next/link";
import { Search, MapPin, UserCircle } from "lucide-react";

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
            {/* Shared Premium Navbar */}
            <Navbar />

            {/* Main Content */}
            <main className="flex-1 pb-20 md:pb-6">
                {children}
            </main>

            {/* Mobile Bottom Navigation (Quick Access) */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl px-6 py-3 flex justify-between items-center z-50 pb-safe shadow-[0_-8px_30px_rgba(0,0,0,0.04)]">
                <Link href="/app/search" className="flex flex-col items-center gap-1 text-slate-400 hover:text-brand-green transition-colors">
                    <Search className="w-6 h-6" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Spots</span>
                </Link>
                <Link href="/app/host" className="flex flex-col items-center gap-1 text-slate-400 hover:text-brand-purple transition-colors">
                    <MapPin className="w-6 h-6" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Hôte</span>
                </Link>
                <Link href="/app/profile" className="flex flex-col items-center gap-1 text-slate-400 hover:text-brand-cyan transition-colors">
                    <UserCircle className="w-6 h-6" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Profil</span>
                </Link>
            </nav>
        </div>
    );
}
