'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Loader2, Mail, Clock } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');
    const notice = searchParams.get('notice');

    const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'notice' | 'no-token'>(
        notice === '1' ? 'notice' : !token ? 'no-token' : 'loading'
    );
    const [errorMessage, setErrorMessage] = useState('');
    const [resendEmail, setResendEmail] = useState('');
    const [resendStatus, setResendStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

    useEffect(() => {
        if (!token || notice === '1') return;

        const verify = async () => {
            try {
                const res = await fetch(`/api/auth/verify-email?token=${token}`);
                const data = await res.json();
                if (res.ok) {
                    setStatus('success');
                    setTimeout(() => router.push('/login?verified=1'), 3000);
                } else {
                    setStatus('error');
                    setErrorMessage(data.error ?? 'Lien invalide.');
                }
            } catch {
                setStatus('error');
                setErrorMessage('Une erreur réseau est survenue.');
            }
        };

        verify();
    }, [token, notice, router]);

    const handleResend = async () => {
        if (!resendEmail) return;
        setResendStatus('loading');
        try {
            const res = await fetch('/api/auth/resend-verification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: resendEmail }),
            });
            setResendStatus(res.ok ? 'done' : 'error');
        } catch {
            setResendStatus('error');
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[var(--background)]">
            <header className="border-b border-[var(--border)]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
                    <Link href="/"><Logo /></Link>
                    <ThemeToggle />
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center py-12 px-4">
                <div className="w-full max-w-md space-y-6 text-center">

                    {/* NOTICE: user tried to access app without verifying */}
                    {status === 'notice' && (
                        <>
                            <div className="w-14 h-14 rounded-full bg-amber-50 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-800 flex items-center justify-center mx-auto">
                                <Clock className="h-7 w-7 text-amber-600" />
                            </div>
                            <div>
                                <h1 className="text-xl font-semibold text-[var(--foreground)]">Confirmez votre email</h1>
                                <p className="text-sm text-[var(--muted)] mt-2 leading-relaxed">
                                    Un email de confirmation a été envoyé lors de votre inscription.<br />
                                    Cliquez sur le lien dans cet email pour accéder à Loopark.
                                </p>
                            </div>

                            <div className="border border-[var(--border)] rounded-lg p-6 text-left space-y-4">
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-[var(--muted)]" />
                                    <p className="text-sm font-medium text-[var(--foreground)]">Vous n'avez pas reçu l'email ?</p>
                                </div>
                                <p className="text-xs text-[var(--muted)]">Vérifiez vos spams ou renvoyez un nouveau lien.</p>
                                <div className="flex gap-2">
                                    <input
                                        type="email"
                                        placeholder="votre@email.com"
                                        value={resendEmail}
                                        onChange={(e) => setResendEmail(e.target.value)}
                                        className="flex-1 h-9 rounded-md border border-[var(--border)] px-3 text-sm bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-brand-green transition-colors"
                                    />
                                    <button
                                        onClick={handleResend}
                                        disabled={resendStatus === 'loading' || resendStatus === 'done'}
                                        className="inline-flex items-center gap-1.5 text-sm font-medium bg-brand-green text-white px-4 py-2 rounded-md hover:bg-brand-green-dark transition-colors disabled:opacity-50 whitespace-nowrap"
                                    >
                                        {resendStatus === 'loading' && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                                        Renvoyer
                                    </button>
                                </div>
                                {resendStatus === 'done' && (
                                    <p className="text-xs text-brand-green">✓ Email renvoyé ! Vérifiez votre boîte de réception.</p>
                                )}
                                {resendStatus === 'error' && (
                                    <p className="text-xs text-red-600">Erreur lors de l'envoi. Vérifiez l'adresse email.</p>
                                )}
                            </div>
                            <Link href="/login" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                                ← Retour à la connexion
                            </Link>
                        </>
                    )}

                    {/* LOADING: verifying token */}
                    {status === 'loading' && (
                        <>
                            <div className="w-14 h-14 rounded-full border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center mx-auto">
                                <Loader2 className="h-6 w-6 text-[var(--muted)] animate-spin" />
                            </div>
                            <div>
                                <h1 className="text-xl font-semibold text-[var(--foreground)]">Vérification en cours…</h1>
                                <p className="text-sm text-[var(--muted)] mt-2">Veuillez patienter.</p>
                            </div>
                        </>
                    )}

                    {/* SUCCESS */}
                    {status === 'success' && (
                        <>
                            <div className="w-14 h-14 rounded-full bg-brand-green/10 border border-brand-green/20 flex items-center justify-center mx-auto">
                                <CheckCircle className="h-7 w-7 text-brand-green" />
                            </div>
                            <div>
                                <h1 className="text-xl font-semibold text-[var(--foreground)]">Email confirmé !</h1>
                                <p className="text-sm text-[var(--muted)] mt-2">
                                    Votre adresse email a été vérifiée avec succès.<br />
                                    Redirection vers la connexion…
                                </p>
                            </div>
                            <Link href="/login" className="inline-flex items-center text-sm font-medium text-brand-green hover:underline underline-offset-2">
                                Se connecter maintenant →
                            </Link>
                        </>
                    )}

                    {/* ERROR or NO TOKEN */}
                    {(status === 'error' || status === 'no-token') && (
                        <>
                            <div className="w-14 h-14 rounded-full bg-red-50 border border-red-200 dark:bg-red-950/30 dark:border-red-900 flex items-center justify-center mx-auto">
                                <XCircle className="h-7 w-7 text-red-500" />
                            </div>
                            <div>
                                <h1 className="text-xl font-semibold text-[var(--foreground)]">Lien invalide</h1>
                                <p className="text-sm text-[var(--muted)] mt-2">
                                    {status === 'no-token' ? 'Aucun token de vérification trouvé.' : errorMessage}
                                </p>
                            </div>

                            <div className="border border-[var(--border)] rounded-lg p-6 text-left space-y-4">
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-[var(--muted)]" />
                                    <p className="text-sm font-medium text-[var(--foreground)]">Renvoyer l'email de confirmation</p>
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="email"
                                        placeholder="votre@email.com"
                                        value={resendEmail}
                                        onChange={(e) => setResendEmail(e.target.value)}
                                        className="flex-1 h-9 rounded-md border border-[var(--border)] px-3 text-sm bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-brand-green transition-colors"
                                    />
                                    <button
                                        onClick={handleResend}
                                        disabled={resendStatus === 'loading' || resendStatus === 'done'}
                                        className="inline-flex items-center gap-1.5 text-sm font-medium bg-brand-green text-white px-4 py-2 rounded-md hover:bg-brand-green-dark transition-colors disabled:opacity-50 whitespace-nowrap"
                                    >
                                        {resendStatus === 'loading' && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                                        Renvoyer
                                    </button>
                                </div>
                                {resendStatus === 'done' && (
                                    <p className="text-xs text-brand-green">✓ Email renvoyé ! Vérifiez votre boîte de réception.</p>
                                )}
                                {resendStatus === 'error' && (
                                    <p className="text-xs text-red-600">Erreur lors de l'envoi. Vérifiez l'adresse email.</p>
                                )}
                            </div>
                            <Link href="/login" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                                ← Retour à la connexion
                            </Link>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense>
            <VerifyEmailContent />
        </Suspense>
    );
}
