'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { ArrowRight, ShieldCheck, Zap, Heart, Globe, Sparkles, Navigation, UserCircle } from 'lucide-react';

export default function Home() {
    const { data: session, status } = useSession();
    const isLoading = status === "loading";
    const isLoggedIn = !!session;

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 overflow-hidden">
            {/* Background Ornaments */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-brand-green/5 rounded-full blur-[160px] pointer-events-none animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-brand-purple/5 rounded-full blur-[160px] pointer-events-none animate-pulse" />

            {/* Header */}
            <header className="fixed w-full z-50 glass border-b border-border-color">
                <div className="container mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
                    <Link href="/">
                        <Logo className="h-10" />
                    </Link>
                    <div className="flex items-center gap-4">
                        {!isLoading && (
                            <>
                                {isLoggedIn ? (
                                    <Link href="/app/search">
                                        <Button className="font-bold px-8 flex items-center gap-2">
                                            <UserCircle className="h-5 w-5" /> MON ESPACE
                                        </Button>
                                    </Link>
                                ) : (
                                    <>
                                        <Link href="/login" className="hidden sm:block">
                                            <Button variant="ghost" className="font-bold">Connexion</Button>
                                        </Link>
                                        <Link href="/register">
                                            <Button className="font-bold px-8">Rejoindre</Button>
                                        </Link>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex-1 pt-32 relative z-10">
                <section className="container mx-auto px-4 py-20 flex flex-col items-center text-center">
                    <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-brand-green/10 text-brand-green text-xs font-black uppercase tracking-widest border border-brand-green/20 mb-10 animate-bounce">
                        <Sparkles className="h-4 w-4" />
                        La Mobilité Urbaine Réinventée
                    </div>

                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 max-w-5xl leading-[0.9] text-slate-900 dark:text-white">
                        Ne laissez plus votre <span className="gradient-text">liberté</span> au hasard.
                    </h1>

                    <p className="text-xl md:text-2xl font-medium text-slate-500 dark:text-slate-400 max-w-2xl mb-12 leading-relaxed">
                        Loopark sécurise vos trajets en vous connectant à un réseau exclusif de parkings de confiance pour vélos et trottinettes.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 w-full justify-center px-4">
                        <Link href="/app/search">
                            <Button size="lg" className="h-16 px-12 text-lg w-full sm:w-auto font-black shadow-2xl shadow-brand-green/20">
                                DÉCOUVRIR LE RÉSEAU <Navigation className="ml-3 h-6 w-6" />
                            </Button>
                        </Link>
                        <Link href="/register">
                            <Button variant="outline" size="lg" className="h-16 px-12 text-lg w-full sm:w-auto font-black">
                                DEVENIR HÔTE
                            </Button>
                        </Link>
                    </div>

                    {/* Trust indicators */}
                    <div className="mt-20 flex flex-wrap justify-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                        <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white"><ShieldCheck className="h-6 w-6" /> SÉCURISÉ</div>
                        <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white"><Zap className="h-6 w-6" /> INSTANTANÉ</div>
                        <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white"><Heart className="h-6 w-6" /> COMMUNAUTAIRE</div>
                    </div>
                </section>

                {/* Split Feature View */}
                <section className="container mx-auto px-4 py-32 grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="group p-10 rounded-[3rem] bg-white dark:bg-slate-900 shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-50 dark:border-slate-800 transition-all duration-500 hover:-translate-y-4">
                        <div className="w-16 h-16 bg-brand-green/10 rounded-2xl flex items-center justify-center mb-8 border border-brand-green/20 transform group-hover:rotate-12 transition-transform">
                            <Zap className="h-8 w-8 text-brand-green" />
                        </div>
                        <h3 className="text-2xl font-black mb-4">Réservation Éclair</h3>
                        <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                            Oubliez les recherches interminables. Trouvez et réservez votre spot en moins de 30 secondes.
                        </p>
                    </div>

                    <div className="group p-10 rounded-[3rem] bg-brand-purple text-white shadow-2xl shadow-brand-purple/20 transition-all duration-500 hover:-translate-y-4 ring-8 ring-brand-purple/5">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 border border-white/20 transform group-hover:-rotate-12 transition-transform">
                            <ShieldCheck className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-black mb-4">Sérénité Totale</h3>
                        <p className="text-white/80 font-medium leading-relaxed font-semibold">
                            Chaque place est vérifiée et assurée. Vos biens sont protégés au cœur de notre réseau certifié.
                        </p>
                    </div>

                    <div className="group p-10 rounded-[3rem] bg-white dark:bg-slate-900 shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-50 dark:border-slate-800 transition-all duration-500 hover:-translate-y-4">
                        <div className="w-16 h-16 bg-brand-cyan/10 rounded-2xl flex items-center justify-center mb-8 border border-brand-cyan/20 transform group-hover:rotate-12 transition-transform">
                            <Globe className="h-8 w-8 text-brand-cyan" />
                        </div>
                        <h3 className="text-2xl font-black mb-4">Eco-Impact</h3>
                        <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                            Loopark récompense votre engagement pour la planète. Suivez votre score carbone à chaque trajet.
                        </p>
                    </div>
                </section>
            </main>

            <footer className="border-t border-border-color py-16 bg-slate-50 dark:bg-slate-950 relative z-10">
                <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
                    <Logo className="h-8" />
                    <div className="flex gap-8 text-xs font-black text-slate-400 uppercase tracking-widest">
                        <Link href="#" className="hover:text-brand-purple transition-colors">Politique</Link>
                        <Link href="#" className="hover:text-brand-purple transition-colors">Conditions</Link>
                        <Link href="#" className="hover:text-brand-purple transition-colors">Contact</Link>
                    </div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
                        © {new Date().getFullYear()} LOOPARK TECHNOLOGIES. TOUS DROITS RÉSERVÉS.
                    </p>
                </div>
            </footer>
        </div>
    );
}
