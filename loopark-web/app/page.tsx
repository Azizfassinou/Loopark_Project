'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { ArrowRight, ShieldCheck, Zap, Globe } from 'lucide-react';

export default function Home() {
    const { data: session, status } = useSession();
    const isLoading = status === 'loading';
    const isLoggedIn = !!session;

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
            {/* Header */}
            <header className="border-b border-[var(--border)]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
                    <Logo />
                    <nav className="flex items-center gap-6">
                        {!isLoading && (
                            <>
                                {isLoggedIn ? (
                                    <Link
                                        href="/app/search"
                                        className="flex items-center gap-2 text-sm font-medium bg-brand-green text-white px-4 py-1.5 rounded-md hover:bg-brand-green-dark transition-colors"
                                    >
                                        Mon espace <ArrowRight className="h-3.5 w-3.5" />
                                    </Link>
                                ) : (
                                    <>
                                        <Link href="/login" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                                            Connexion
                                        </Link>
                                        <Link
                                            href="/register"
                                            className="text-sm font-medium bg-[var(--foreground)] text-[var(--background)] px-4 py-1.5 rounded-md hover:opacity-80 transition-opacity"
                                        >
                                            S'inscrire
                                        </Link>
                                    </>
                                )}
                            </>
                        )}
                    </nav>
                </div>
            </header>

            {/* Hero */}
            <main>
                <section className="max-w-6xl mx-auto px-4 sm:px-6 py-24 md:py-36">
                    <div className="max-w-3xl">
                        <p className="text-sm font-medium text-brand-green mb-6">
                            Mobilité urbaine sécurisée
                        </p>
                        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-tight mb-6 text-[var(--foreground)]">
                            Réservez votre place de parking en quelques secondes.
                        </h1>
                        <p className="text-lg text-[var(--muted)] mb-10 max-w-xl leading-relaxed">
                            Loopark connecte les propriétaires d'espaces avec les utilisateurs de vélos et trottinettes à Paris.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link
                                href="/app/search"
                                className="inline-flex items-center justify-center gap-2 bg-brand-green text-white text-sm font-medium px-6 py-2.5 rounded-md hover:bg-brand-green-dark transition-colors"
                            >
                                Découvrir les spots
                            </Link>
                            <Link
                                href="/register"
                                className="inline-flex items-center justify-center gap-2 border border-[var(--border)] text-[var(--foreground)] text-sm font-medium px-6 py-2.5 rounded-md hover:bg-[var(--surface)] transition-colors"
                            >
                                Devenir hôte
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Divider */}
                <div className="border-t border-[var(--border)]" />

                {/* Features */}
                <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="space-y-3">
                            <div className="w-8 h-8 rounded-md bg-brand-green/10 flex items-center justify-center">
                                <Zap className="h-4 w-4 text-brand-green" />
                            </div>
                            <h3 className="text-base font-semibold">Réservation instantanée</h3>
                            <p className="text-sm text-[var(--muted)] leading-relaxed">
                                Trouvez et réservez un spot en moins de 30 secondes, sans paperasse.
                            </p>
                        </div>
                        <div className="space-y-3">
                            <div className="w-8 h-8 rounded-md bg-brand-green/10 flex items-center justify-center">
                                <ShieldCheck className="h-4 w-4 text-brand-green" />
                            </div>
                            <h3 className="text-base font-semibold">Places vérifiées</h3>
                            <p className="text-sm text-[var(--muted)] leading-relaxed">
                                Chaque espace est contrôlé pour garantir votre sécurité et celle de votre véhicule.
                            </p>
                        </div>
                        <div className="space-y-3">
                            <div className="w-8 h-8 rounded-md bg-brand-green/10 flex items-center justify-center">
                                <Globe className="h-4 w-4 text-brand-green" />
                            </div>
                            <h3 className="text-base font-semibold">Impact carbone positif</h3>
                            <p className="text-sm text-[var(--muted)] leading-relaxed">
                                Chaque trajet en mobilité douce contribue à un Paris plus propre.
                            </p>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-[var(--border)]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <Logo />
                    <div className="flex gap-6 text-xs text-[var(--muted)]">
                        <Link href="/mentions-legales" className="hover:text-[var(--foreground)] transition-colors">Politique</Link>
                        <Link href="/mentions-legales/conditions" className="hover:text-[var(--foreground)] transition-colors">Conditions</Link>
                        <Link href="mailto:contact@loopark.fr" className="hover:text-[var(--foreground)] transition-colors">Contact</Link>
                    </div>
                    <p className="text-xs text-[var(--muted)]">
                        © {new Date().getFullYear()} Loopark
                    </p>
                </div>
            </footer>
        </div>
    );
}
