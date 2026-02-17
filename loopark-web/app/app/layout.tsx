import Link from "next/link";
import { Search, MapPin, UserCircle, Menu } from "lucide-react";

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
            {/* Top Header - Mobile & Desktop */}
            <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/app/search" className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-2">
                        <span className="text-2xl">🚲</span> Loopark
                    </Link>

                    <nav className="hidden md:flex items-center gap-6">
                        <Link href="/app/search" className="text-sm font-medium hover:text-green-600 transition-colors flex items-center gap-2">
                            <Search className="w-4 h-4" /> Rechercher
                        </Link>
                        <Link href="/app/host" className="text-sm font-medium hover:text-green-600 transition-colors flex items-center gap-2">
                            <MapPin className="w-4 h-4" /> Je propose un spot
                        </Link>
                        <Link href="/app/profile" className="text-sm font-medium hover:text-green-600 transition-colors flex items-center gap-2">
                            <UserCircle className="w-4 h-4" /> Mon Compte
                        </Link>
                    </nav>

                    <div className="md:hidden">
                        <button className="p-2 text-gray-600">
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 container mx-auto px-4 py-6 mb-16 md:mb-6">
                {children}
            </main>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-6 py-3 flex justify-between items-center z-50 pb-safe shadow-[0_-1px_3px_rgba(0,0,0,0.05)]">
                <Link href="/app/search" className="flex flex-col items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-500 transition-colors">
                    <Search className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Chercher</span>
                </Link>
                <Link href="/app/host" className="flex flex-col items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-500 transition-colors">
                    <MapPin className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Hôte</span>
                </Link>
                <Link href="/app/profile" className="flex flex-col items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-500 transition-colors">
                    <UserCircle className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Profil</span>
                </Link>
            </nav>
        </div>
    );
}
