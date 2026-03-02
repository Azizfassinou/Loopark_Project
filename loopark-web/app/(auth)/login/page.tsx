'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { Lock, Mail, ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (searchParams.get('registered')) {
      setShowSuccess(true);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error('Email ou mot de passe incorrect');
      }

      router.push('/app/search');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#fdfdfd] dark:bg-[#020617] text-slate-900 dark:text-slate-100 selection:bg-brand-green/30 relative overflow-x-hidden font-sans">
      {/* Visual background ornamentation */}
      <div className="absolute top-[-10%] left-[-5%] w-[800px] h-[800px] bg-brand-green/5 rounded-full blur-[160px] pointer-events-none opacity-60 mix-blend-multiply dark:mix-blend-overlay" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[800px] h-[800px] bg-brand-purple/5 rounded-full blur-[160px] pointer-events-none opacity-60 mix-blend-multiply dark:mix-blend-overlay" />

      {/* Navigation Header */}
      <nav className="absolute top-0 w-full z-50">
        <div className="max-w-[1800px] mx-auto px-8 md:px-16 lg:px-24 h-24 flex items-center justify-between">
          <Link href="/" className="hover:scale-105 transition-transform duration-300">
            <Logo className="h-10 md:h-12" />
          </Link>
          <div className="hidden md:flex items-center gap-12">
            <Link href="/" className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 hover:text-brand-green transition-colors">Découvrir</Link>
            <Link href="/register">
              <Button variant="ghost" className="font-black text-sm uppercase tracking-widest text-slate-500 hover:text-brand-purple">
                S'inscrire
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content: Split layout on Desktop */}
      <main className="relative flex flex-col lg:flex-row min-h-screen">

        {/* Left Side: Branding and Visual Impact */}
        <section className="hidden lg:flex flex-1 flex-col justify-center px-16 lg:px-24 xl:px-32 space-y-16 relative overflow-hidden">
          <div className="space-y-10 max-w-[800px] animate-in fade-in slide-in-from-left-8 duration-700 ease-out">
            <div className="inline-flex items-center gap-4 px-6 py-2 rounded-full bg-slate-900/5 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 w-fit">
              <Sparkles className="h-4 w-4 text-brand-purple animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Accès Premium Sécurisé</span>
            </div>

            <h1 className="text-8xl xl:text-9xl 2xl:text-[10rem] font-black tracking-tighter leading-[0.85] text-slate-900 dark:text-white">
              Connex<span className="gradient-text">ion</span>.
            </h1>

            <div className="space-y-6 max-w-[600px]">
              <p className="text-2xl font-medium text-slate-400 leading-relaxed">
                Entrez vos identifiants pour gérer votre mobilité urbaine en toute simplicité.
              </p>
              <div className="flex items-center gap-8 pt-6">
                <div className="flex -space-x-3">
                  <div className="h-12 w-12 rounded-full border-4 border-white dark:border-slate-950 bg-brand-green/20 overflow-hidden" />
                  <div className="h-12 w-12 rounded-full border-4 border-white dark:border-slate-950 bg-brand-purple/20 overflow-hidden" />
                  <div className="h-12 w-12 rounded-full border-4 border-white dark:border-slate-950 bg-brand-cyan/20 overflow-hidden" />
                </div>
                <p className="text-sm font-bold text-slate-400">+10k utilisateurs actifs</p>
              </div>
            </div>
          </div>
        </section>

        {/* Right Side: Authentication form */}
        <section className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-24 relative z-10">
          <div className="w-full max-w-[560px] space-y-10 animate-in fade-in zoom-in-95 duration-700 delay-150">
            {/* Mobile Title (hidden on desktop) */}
            <div className="lg:hidden flex flex-col items-center text-center space-y-4 pt-12">
              <Logo className="h-12 mb-4" />
              <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Bon retour !</h2>
              <p className="text-slate-500 font-medium">Connectez-vous à votre espace Loopark.</p>
            </div>

            <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl rounded-[3.5rem] p-10 md:p-16 shadow-[0_32px_80px_-20px_rgba(0,0,0,0.08)] dark:shadow-none border border-white dark:border-white/5 relative group">
              {/* Soft Inner Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-green/5 to-brand-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[3.5rem] pointer-events-none" />

              <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                {showSuccess && (
                  <div className="p-5 rounded-3xl bg-brand-green/5 text-brand-green text-sm font-black border border-brand-green/10 flex items-center gap-4 animate-in slide-in-from-top-4 duration-500">
                    <CheckCircle2 className="h-6 w-6 flex-shrink-0" />
                    Compte activé ! Connectez-vous.
                  </div>
                )}

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

                  <div className="space-y-3">
                    <Input
                      name="password"
                      type="password"
                      label="Votre Mot de passe"
                      placeholder="••••••••"
                      required
                    />
                    <div className="flex justify-end px-2">
                      <Link href="#" className="text-xs font-black text-brand-purple hover:text-brand-green transition-colors uppercase tracking-widest decoration-2 underline-offset-8 hover:underline">
                        Oublié ?
                      </Link>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-20 rounded-[2.5rem] text-xl font-black tracking-widest shadow-2xl shadow-brand-green/20 active:scale-95 transition-all duration-300"
                  isLoading={isLoading}
                >
                  SE CONNECTER <ArrowRight className="ml-4 h-7 w-7" />
                </Button>
              </form>

              <div className="mt-12 pt-10 border-t border-slate-100 dark:border-white/5 flex flex-col items-center gap-6 relative z-10">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                  Pas encore de compte ?
                </p>
                <Link href="/register" className="w-full group/link">
                  <Button variant="outline" className="w-full h-16 rounded-3xl font-black text-xs tracking-[0.2em] border-2 border-slate-100 dark:border-white/10 hover:border-brand-green hover:bg-transparent transition-all">
                    CRÉER MON ESPACE GRATUIT
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

        {/* Floating background elements for depth */}
        <div className="hidden lg:block absolute top-[20%] right-[10%] w-64 h-64 bg-brand-cyan/5 rounded-full blur-[80px] pointer-events-none mix-blend-screen" />
      </main>

      <footer className="py-10 border-t border-slate-100 dark:border-white/5 bg-white dark:bg-slate-950/50">
        <div className="max-w-[1800px] mx-auto px-8 md:px-24 flex flex-col md:flex-row justify-between items-center gap-8 opacity-40">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">© 2026 Loopark Technologies — Built for City Pulse</p>
          <div className="flex gap-12 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
            <Link href="#" className="hover:text-brand-green transition-colors">Politique</Link>
            <Link href="#" className="hover:text-brand-purple transition-colors">Mentions</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
