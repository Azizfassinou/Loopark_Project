'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { Lock, Mail, User, ArrowRight, ShieldCheck, CheckCircle2, Sparkles, Shield, MapPin } from 'lucide-react';

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');
        const name = formData.get('name');

        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, name }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Une erreur est survenue');
            }

            // Success - redirect to login
            router.push('/login?registered=true');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#fdfdfd] dark:bg-[#020617] text-slate-900 dark:text-slate-100 selection:bg-brand-purple/30 relative overflow-x-hidden font-sans">
            {/* Visual background ornamentation */}
            <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-brand-purple/5 rounded-full blur-[160px] pointer-events-none opacity-60 mix-blend-multiply dark:mix-blend-overlay" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[800px] h-[800px] bg-brand-green/5 rounded-full blur-[160px] pointer-events-none opacity-60 mix-blend-multiply dark:mix-blend-overlay" />

            {/* Navigation Header */}
            <nav className="absolute top-0 w-full z-50">
                <div className="max-w-[1800px] mx-auto px-8 md:px-16 lg:px-24 h-24 flex items-center justify-between">
                    <Link href="/" className="hover:scale-105 transition-transform duration-300">
                        <Logo className="h-10 md:h-12" />
                    </Link>
                    <div className="hidden md:flex items-center gap-12">
                        <Link href="/" className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 hover:text-brand-purple transition-colors">Découvrir</Link>
                        <Link href="/login">
                            <Button variant="ghost" className="font-black text-sm uppercase tracking-widest text-slate-500 hover:text-brand-green">
                                Se connecter
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Main Content: Split layout on Desktop */}
            <main className="relative flex flex-col lg:flex-row-reverse min-h-screen">

                {/* Visual Impact Side (now on right for register) */}
                <section className="hidden lg:flex flex-1 flex-col justify-center px-16 lg:px-24 xl:px-32 space-y-16 relative overflow-hidden">
                    <div className="space-y-10 max-w-[800px] animate-in fade-in slide-in-from-right-8 duration-700 ease-out">
                        <div className="inline-flex items-center gap-4 px-6 py-2 rounded-full bg-slate-900/5 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 w-fit">
                            <Sparkles className="h-4 w-4 text-brand-green animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Rejoindre l'élite urbaine</span>
                        </div>

                        <h1 className="text-8xl xl:text-9xl 2xl:text-[10rem] font-black tracking-tighter leading-[0.85] text-slate-900 dark:text-white">
                            Inscrip<span className="gradient-text">tion</span>.
                        </h1>

                        <div className="grid grid-cols-2 gap-12 pt-10">
                            <div className="space-y-4">
                                <div className="h-16 w-16 rounded-2xl bg-brand-green/10 flex items-center justify-center">
                                    <Shield className="h-8 w-8 text-brand-green" />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-lg font-black uppercase tracking-widest">Confiance</p>
                                    <p className="text-slate-400 font-medium">Chaque spot est certifié par nos équipes pour votre tranquillité.</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="h-16 w-16 rounded-2xl bg-brand-purple/10 flex items-center justify-center">
                                    <MapPin className="h-8 w-8 text-brand-purple" />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-lg font-black uppercase tracking-widest">Liberté</p>
                                    <p className="text-slate-400 font-medium">Un réseau qui grandit chaque jour pour vous suivre partout.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Form Side */}
                <section className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-24 relative z-10">
                    <div className="w-full max-w-[640px] space-y-10 animate-in fade-in zoom-in-95 duration-700 delay-150">
                        {/* Mobile Title */}
                        <div className="lg:hidden flex flex-col items-center text-center space-y-4 pt-12">
                            <Logo className="h-12 mb-4" />
                            <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Bienvenue !</h2>
                            <p className="text-slate-500 font-medium">Rejoignez la communauté Loopark dès maintenant.</p>
                        </div>

                        <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl rounded-[3.5rem] p-10 md:p-16 shadow-[0_32px_80px_-20px_rgba(0,0,0,0.08)] dark:shadow-none border border-white dark:border-white/5 relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/5 to-brand-green/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[3.5rem] pointer-events-none" />

                            <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                                {error && (
                                    <div className="p-5 rounded-3xl bg-red-500/5 text-red-600 text-sm font-black border border-red-500/10 animate-in shake duration-500">
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-8">
                                    <Input
                                        name="name"
                                        type="text"
                                        label="Nom Complet"
                                        placeholder="Jean Dupont"
                                        required
                                        autoFocus
                                    />

                                    <Input
                                        name="email"
                                        type="email"
                                        label="Adresse Email"
                                        placeholder="nom@exemple.com"
                                        required
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <Input
                                            name="password"
                                            type="password"
                                            label="Mot de passe"
                                            placeholder="••••••••"
                                            required
                                        />

                                        <Input
                                            name="confirmPassword"
                                            type="password"
                                            label="Confirmation"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 px-2">
                                    <div className="pt-1">
                                        <input type="checkbox" required className="h-6 w-6 rounded-lg border-2 border-slate-200 text-brand-purple focus:ring-brand-purple cursor-pointer transition-all" id="terms" />
                                    </div>
                                    <label htmlFor="terms" className="text-xs font-semibold text-slate-400 dark:text-slate-500 leading-relaxed cursor-pointer select-none">
                                        J'accepte les <Link href="#" className="font-bold text-brand-purple hover:underline underline-offset-4">conditions d'utilisation</Link> de Loopark et la <Link href="#" className="font-bold text-brand-purple hover:underline underline-offset-4">politique de confidentialité</Link>.
                                    </label>
                                </div>

                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full h-20 rounded-[2.5rem] text-xl font-black tracking-widest shadow-2xl shadow-brand-purple/20 active:scale-95 transition-all duration-300"
                                    isLoading={isLoading}
                                >
                                    S'INSCRIRE MAINTENANT <ArrowRight className="ml-4 h-7 w-7" />
                                </Button>
                            </form>

                            <div className="mt-12 pt-10 border-t border-slate-100 dark:border-white/5 flex flex-col items-center gap-6 relative z-10">
                                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                                    Déjà un compte parmi nous ?
                                </p>
                                <Link href="/login" className="w-full">
                                    <Button variant="outline" className="w-full h-16 rounded-3xl font-black text-xs tracking-[0.2em] border-2 border-slate-100 dark:border-white/10 hover:border-brand-purple hover:bg-transparent transition-all">
                                        SE CONNECTER ICI
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="py-10 border-t border-slate-100 dark:border-white/5 bg-white dark:bg-slate-950/50 relative z-20">
                <div className="max-w-[1800px] mx-auto px-8 md:px-24 flex flex-col md:flex-row justify-between items-center gap-8 opacity-40">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">© 2026 Loopark Technologies — The Security Standard</p>
                    <div className="flex gap-12 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
                        <Link href="#" className="hover:text-brand-purple transition-colors">Politique</Link>
                        <Link href="#" className="hover:text-brand-green transition-colors">Mentions</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
