'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [emailSent, setEmailSent] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const firstName = formData.get('firstName') as string;
        const lastName = formData.get('lastName') as string;
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');

        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.get('email'),
                    password,
                    firstName,
                    lastName,
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Une erreur est survenue');
            // Show email confirmation notice instead of redirecting
            setEmailSent(formData.get('email') as string);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--background)] flex flex-col">
            {/* Header */}
            <header className="border-b border-[var(--border)]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
                    <Link href="/"><Logo /></Link>
                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <Link href="/login" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                            Se connecter
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center py-12 px-4">
                {emailSent ? (
                    /* ── Email sent confirmation ── */
                    <div className="w-full max-w-sm space-y-6 text-center">
                        <div className="w-14 h-14 rounded-full bg-brand-green/10 border border-brand-green/20 flex items-center justify-center mx-auto">
                            <svg className="h-7 w-7 text-brand-green" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold text-[var(--foreground)]">Vérifiez votre email</h1>
                            <p className="text-sm text-[var(--muted)] mt-2 leading-relaxed">
                                Un email de confirmation a été envoyé à <strong className="text-[var(--foreground)]">{emailSent}</strong>.<br />
                                Cliquez sur le lien pour activer votre compte.
                            </p>
                        </div>
                        <div className="text-xs text-[var(--muted)] space-y-1">
                            <p>Vérifiez votre dossier spams si vous ne le trouvez pas.</p>
                            <p>Le lien expire dans <strong>24 heures</strong>.</p>
                        </div>
                        <Link href="/login" className="inline-block text-sm text-brand-green hover:underline underline-offset-2">
                            ← Retour à la connexion
                        </Link>
                    </div>
                ) : (
                <div className="w-full max-w-sm space-y-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-[var(--foreground)]">Créer un compte</h1>
                        <p className="text-sm text-[var(--muted)] mt-1">Rejoignez le réseau Loopark</p>
                    </div>

                    {error && (
                        <div className="text-sm text-red-600 bg-red-50 border border-red-200 dark:bg-red-950/30 dark:border-red-900 rounded-md px-3 py-2">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Prénom + Nom — 2 colonnes */}
                        <div className="grid grid-cols-2 gap-3">
                            <Input
                                name="firstName"
                                type="text"
                                label="Prénom"
                                placeholder="Jean"
                                required
                                autoFocus
                            />
                            <Input
                                name="lastName"
                                type="text"
                                label="Nom"
                                placeholder="Dupont"
                                required
                            />
                        </div>
                        <Input
                            name="email"
                            type="email"
                            label="Email"
                            placeholder="nom@exemple.com"
                            required
                        />
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
                            label="Confirmer le mot de passe"
                            placeholder="••••••••"
                            required
                        />

                        <div className="flex items-start gap-2 pt-1">
                            <input
                                type="checkbox"
                                id="terms"
                                required
                                className="mt-0.5 h-4 w-4 rounded border-[var(--border)] text-brand-green focus:ring-brand-green cursor-pointer"
                            />
                            <label htmlFor="terms" className="text-xs text-[var(--muted)] cursor-pointer leading-relaxed">
                                J'accepte les{' '}
                                <Link href="/mentions-legales/conditions" className="text-[var(--foreground)] hover:underline underline-offset-2">conditions d'utilisation</Link>
                                {' '}et la{' '}
                                <Link href="/mentions-legales/confidentialite" className="text-[var(--foreground)] hover:underline underline-offset-2">politique de confidentialité</Link>.
                            </label>
                        </div>

                        <Button type="submit" className="w-full" isLoading={isLoading}>
                            Créer mon compte
                        </Button>
                    </form>

                    <div className="pt-2 border-t border-[var(--border)] text-center">
                        <p className="text-sm text-[var(--muted)]">
                            Déjà un compte ?{' '}
                            <Link href="/login" className="text-[var(--foreground)] font-medium hover:underline underline-offset-2">
                                Se connecter
                            </Link>
                        </p>
                    </div>
                </div>
                )}
            </main>
        </div>
    );
}
