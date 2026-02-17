import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <header className="fixed w-full z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-2">
                        <span className="text-3xl">🚲</span> Loopark
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link href="/login">
                            <Button variant="ghost">Connexion</Button>
                        </Link>
                        <Link href="/register">
                            <Button>Commencer</Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex-1 pt-24 pb-12">
                <section className="container mx-auto px-4 py-12 md:py-24 flex flex-col items-center text-center">
                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 mb-8">
                        🌿 Mobilité douce & Stationnement sécurisé
                    </div>

                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 max-w-4xl bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white">
                        Trouvez une place sécurisée pour votre vélo en 3 clics
                    </h1>

                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mb-10 leading-relaxed">
                        Loopark connecte les cyclistes aux places de stationnement sécurisées chez les particuliers et commerçants. Roulez l'esprit tranquille.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                        <Link href="/app/search">
                            <Button size="lg" className="h-12 px-8 text-lg w-full sm:w-auto">
                                Trouver une place
                            </Button>
                        </Link>
                        <Link href="/app/host">
                            <Button variant="outline" size="lg" className="h-12 px-8 text-lg w-full sm:w-auto">
                                Proposer un spot
                            </Button>
                        </Link>
                    </div>
                </section>

                {/* Features Preview (Optional but good for MVP landing) */}
                <section className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                    <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-900/50">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4 mx-auto md:mx-0">
                            <span className="text-2xl">⚡️</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Rapide</h3>
                        <p className="text-gray-600 dark:text-gray-400">Réservez instantanément via l'application. Accès direct avec QR Code.</p>
                    </div>

                    <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-900/50">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-4 mx-auto md:mx-0">
                            <span className="text-2xl">🔒</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Sécurisé</h3>
                        <p className="text-gray-600 dark:text-gray-400">Des emplacements vérifiés chez des particuliers ou dans des commerces de confiance.</p>
                    </div>

                    <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-900/50">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-4 mx-auto md:mx-0">
                            <span className="text-2xl">🌱</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Écologique</h3>
                        <p className="text-gray-600 dark:text-gray-400">Favorisez la mobilité douce et suivez votre impact CO2 évité à chaque trajet.</p>
                    </div>
                </section>
            </main>

            <footer className="border-t border-gray-200 dark:border-gray-800 py-8 text-center text-sm text-gray-500">
                <div className="container mx-auto px-4">
                    <p>© {new Date().getFullYear()} Loopark. Tous droits réservés.</p>
                </div>
            </footer>
        </div>
    );
}
