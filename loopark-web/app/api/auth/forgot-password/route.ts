import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Resend } from 'resend';
import crypto from 'crypto';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
const RESEND_API_KEY = process.env.RESEND_API_KEY;

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email requis' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        // Always return success even if user not found (security: don't disclose account existence)
        if (!user) {
            return NextResponse.json({ message: 'Si votre email existe, un lien vous a été envoyé.' });
        }

        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

        // Clear existing tokens
        await prisma.passwordResetToken.deleteMany({
            where: { userId: user.id },
        });

        await prisma.passwordResetToken.create({
            data: {
                userId: user.id,
                token,
                expiresAt,
            },
        });

        const resetLink = `${APP_URL}/reset-password?token=${token}`;

        // Skip sending in dev if API key is missing or is a placeholder
        if (!RESEND_API_KEY || RESEND_API_KEY.startsWith('re_VOTRE')) {
            console.log('\n📧 [DEV] Password reset email skipped (no API key)');
            console.log(`   → Reset URL: ${resetLink}\n`);
            return NextResponse.json({ message: 'Si votre email existe, un lien vous a été envoyé.' });
        }

        try {
            const resend = new Resend(RESEND_API_KEY);
            await resend.emails.send({
                from: `${process.env.RESEND_FROM_NAME} <${process.env.RESEND_FROM_EMAIL}>`,
                to: user.email!,
                subject: 'Réinitialisation de votre mot de passe Loopark',
                html: `
                    <h1>Réinitialisation de mot de passe</h1>
                    <p>Bonjour ${user.name || ''},</p>
                    <p>Vous avez demandé à réinitialiser votre mot de passe sur Loopark.</p>
                    <p>Cliquez sur le lien ci-dessous pour créer un nouveau mot de passe (valide pendant 1 heure) :</p>
                    <a href="${resetLink}">Réinitialiser mon mot de passe</a>
                    <p>Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email.</p>
                `,
            });
        } catch (emailError: any) {
            console.error('Failed to send email:', emailError);
            console.log(`\n📧 [DEV] Fallback Password reset link: ${resetLink}\n`);
        }

        return NextResponse.json({ message: 'Si votre email existe, un lien vous a été envoyé.' });
    } catch (error) {
        console.error('Password reset request error:', error);
        return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
    }
}
