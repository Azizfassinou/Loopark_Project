'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Lock, Mail, User, ArrowRight } from 'lucide-react';

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
        const name = formData.get('name');

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
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
            <Card className="w-full max-w-md shadow-2xl border-none bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
                <div className="h-2 bg-green-500 w-full" />
                <CardHeader className="space-y-1 pt-8">
                    <CardTitle className="text-3xl font-bold text-center text-gray-900 dark:text-white">Créer un compte</CardTitle>
                    <p className="text-center text-gray-500 dark:text-gray-400">Rejoignez Loopark dès aujourd'hui</p>
                </CardHeader>
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium border border-red-100 dark:border-red-800">
                                {error}
                            </div>
                        )}

                        <div className="relative">
                            <User className="absolute left-3 top-[38px] h-4 w-4 text-gray-400 z-10" />
                            <Input
                                name="name"
                                label="Nom complet"
                                placeholder="Jean Dupont"
                                required
                                className="pl-10 h-12 bg-gray-50 dark:bg-gray-900/50 border-gray-100 dark:border-gray-800 rounded-xl"
                            />
                        </div>

                        <div className="relative">
                            <Mail className="absolute left-3 top-[38px] h-4 w-4 text-gray-400 z-10" />
                            <Input
                                name="email"
                                type="email"
                                label="Adresse email"
                                placeholder="jean@example.com"
                                required
                                className="pl-10 h-12 bg-gray-50 dark:bg-gray-900/50 border-gray-100 dark:border-gray-800 rounded-xl"
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-3 top-[38px] h-4 w-4 text-gray-400 z-10" />
                            <Input
                                name="password"
                                type="password"
                                label="Mot de passe"
                                placeholder="••••••••"
                                required
                                className="pl-10 h-12 bg-gray-50 dark:bg-gray-900/50 border-gray-100 dark:border-gray-800 rounded-xl"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all hover:shadow-lg active:scale-[0.98]"
                            isLoading={isLoading}
                        >
                            S'inscrire <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4 pb-8 pt-4">
                    <div className="text-sm text-center text-gray-500 dark:text-gray-400">
                        Vous avez déjà un compte ?{' '}
                        <Link href="/login" className="text-green-600 hover:underline font-semibold">
                            Se connecter
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
