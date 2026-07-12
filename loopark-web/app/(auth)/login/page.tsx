'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { CheckCircle2 } from 'lucide-react';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [notice, setNotice] = useState<'registered' | 'verified' | null>(null);

    useEffect(() => {
        if (searchParams.get('registered')) setNotice('registered');
        else if (searchParams.get('verified')) setNotice('verified');
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        try {
            const result = await signIn('credentials', {
                email: formData.get('email'),
                password: formData.get('password'),
                redirect: false,
            });
            if (result?.error) throw new Error('Email ou mot de passe incorrect');
            router.push('/app/search');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-sm space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-[var(--foreground)]">Connexion</h1>
                <p className="text-sm text-[var(--muted)] mt-1">Accédez à votre espace Loopark</p>
            </div>

            {notice === 'registered' && (
                <div className="flex items-center gap-2 text-sm text-brand-green bg-brand-green/5 border border-brand-green/20 rounded-md px-3 py-2">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                    Compte créé ! Vérifiez votre email pour l'activer.
                </div>
            )}

            {notice === 'verified' && (
                <div className="flex items-center gap-2 text-sm text-brand-green bg-brand-green/5 border border-brand-green/20 rounded-md px-3 py-2">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                    Email vérifié ! Vous pouvez maintenant vous connecter.
                </div>
            )}

            {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 dark:bg-red-950/30 dark:border-red-900 rounded-md px-3 py-2">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    name="email"
                    type="email"
                    label="Email"
                    placeholder="nom@exemple.com"
                    required
                    autoFocus
                />
                <div className="space-y-1">
                    <Input
                        name="password"
                        type="password"
                        label="Mot de passe"
                        placeholder="••••••••"
                        required
                    />
                    <div className="flex justify-end">
                        <Link href="/forgot-password" className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                            Mot de passe oublié ?
                        </Link>
                    </div>
                </div>
                <Button type="submit" className="w-full" isLoading={isLoading}>
                    Se connecter
                </Button>
            </form>

            <div className="pt-2 border-t border-[var(--border)] text-center">
                <p className="text-sm text-[var(--muted)]">
                    Pas encore de compte ?{' '}
                    <Link href="/register" className="text-[var(--foreground)] font-medium hover:underline underline-offset-2">
                        S'inscrire
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-[var(--background)] flex flex-col">
            <header className="border-b border-[var(--border)]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
                    <Link href="/"><Logo /></Link>
                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <Link href="/register" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                            Créer un compte
                        </Link>
                    </div>
                </div>
            </header>
            <main className="flex-1 flex items-center justify-center py-12 px-4">
                <Suspense fallback={<div className="w-full max-w-sm h-64 rounded-lg bg-[var(--surface)] animate-pulse" />}>
                    <LoginForm />
                </Suspense>
            </main>
        </div>
    );
}
