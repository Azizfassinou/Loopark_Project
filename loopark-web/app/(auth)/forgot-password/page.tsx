'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email');

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Une erreur est survenue');
            }

            setSuccess(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#fdfdfd] dark:bg-[#020617] text-slate-900 dark:text-slate-100 selection:bg-brand-green/30 relative overflow-x-hidden font-sans">
            <div className="absolute top-[-10%] left-[-5%] w-[800px] h-[800px] bg-brand-green/10 rounded-full blur-[160px] pointer-events-none opacity-60 mix-blend-multiply dark:mix-blend-overlay" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[800px] h-[800px] bg-brand-green/10 rounded-full blur-[160px] pointer-events-none opacity-60 mix-blend-multiply dark:mix-blend-overlay" />

            <nav className="absolute top-0 w-full z-50">
                <div className="max-w-[1800px] mx-auto px-8 md:px-16 lg:px-24 h-24 flex items-center justify-between">
                    <Link href="/" className="hover:scale-105 transition-transform duration-300">
                        <Logo className="h-11 w-36" />
                    </Link>
                    <div className="hidden md:flex items-center gap-12">
                        <Link href="/login">
                            <Button variant="ghost" className="font-black text-sm uppercase tracking-widest text-slate-500 hover:text-brand-green">
                                Se connecter
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="relative flex flex-col lg:flex-row min-h-screen">
                <section className="hidden lg:flex flex-1 flex-col justify-center px-16 lg:px-24 xl:px-32 space-y-16 relative overflow-hidden">
                    <div className="space-y-10 max-w-[800px] animate-in fade-in slide-in-from-left-8 duration-700 ease-out">
                        <div className="inline-flex items-center gap-4 px-6 py-2 rounded-full bg-slate-900/5 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 w-fit">
                            <Sparkles className="h-4 w-4 text-brand-green animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Récupération Sécurisée</span>
                        </div>

                        <h1 className="text-8xl xl:text-9xl 2xl:text-[10rem] font-black tracking-tighter leading-[0.85] text-slate-900 dark:text-white">
                            Oubli<span className="gradient-text">é</span> ?
                        </h1>

                        <div className="space-y-6 max-w-[600px]">
                            <p className="text-2xl font-medium text-slate-400 leading-relaxed">
                                Pas d'inquiétude, nous allons vous aider à retrouver l'accès à votre espace.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-24 relative z-10">
                    <div className="w-full max-w-[560px] space-y-10 animate-in fade-in zoom-in-95 duration-700 delay-150">
                        <div className="lg:hidden flex flex-col items-center text-center space-y-4 pt-12">
                            <Logo className="h-11 w-36 mb-4" />
                            <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Mot de passe oublié ?</h2>
                        </div>

                        <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl rounded-[3.5rem] p-10 md:p-16 shadow-[0_32px_80px_-20px_rgba(0,0,0,0.08)] dark:shadow-none border border-white dark:border-white/5 relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-brand-green/5 to-brand-green/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[3.5rem] pointer-events-none" />

                            {success ? (
                                <div className="space-y-6 relative z-10 text-center animate-in fade-in zoom-in duration-500">
                                    <div className="w-20 h-20 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle2 className="h-10 w-10 text-brand-green" />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">Email envoyé</h3>
                                    <p className="text-slate-500">Si votre email existe, vous recevrez un lien pour réinitialiser votre mot de passe d'ici quelques instants.</p>
                                    <Link href="/login" className="block pt-8">
                                        <Button className="w-full h-16 rounded-3xl font-black text-xs tracking-[0.2em]">
                                            RETOUR À LA CONNEXION
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                                    {error && (
                                        <div className="p-5 rounded-3xl bg-red-500/5 text-red-600 text-sm font-black border border-red-500/10 animate-in shake duration-500">
                                            {error}
                                        </div>
                                    )}

                                    <div className="space-y-8">
                                        <Input
                                            name="email"
                                            type="email"
                                            label="Votre Email"
                                            placeholder="nom@exemple.com"
                                            required
                                            autoFocus
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="w-full h-20 rounded-[2.5rem] text-xl font-black tracking-widest shadow-2xl shadow-brand-green/20 active:scale-95 transition-all duration-300"
                                        isLoading={isLoading}
                                    >
                                        ENVOYER LE LIEN <ArrowRight className="ml-4 h-7 w-7" />
                                    </Button>
                                </form>
                            )}

                            <div className="mt-12 pt-10 border-t border-slate-100 dark:border-white/5 flex flex-col items-center gap-6 relative z-10">
                                <Link href="/login" className="w-full group/link">
                                    <Button variant="outline" className="w-full h-16 rounded-3xl font-black text-xs tracking-[0.2em] border-2 border-slate-100 dark:border-white/10 hover:border-brand-green hover:bg-transparent transition-all">
                                        ANNULER ET RETOURNER
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-4 text-slate-300 dark:text-slate-600">
                            <div className="h-px flex-1 bg-slate-100 dark:bg-white/5" />
                            <div className="flex items-center gap-3 px-2 text-[9px] font-black uppercase tracking-[0.4em]">
                                <ShieldCheck className="h-4 w-4 text-brand-green/40" />
                                Secured by Loopark
                            </div>
                            <div className="h-px flex-1 bg-slate-100 dark:bg-white/5" />
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
