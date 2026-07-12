import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email requis' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email },
            select: { id: true, name: true, emailVerified: true },
        });

        // Don't disclose if user exists or not
        if (!user) {
            return NextResponse.json({ success: true });
        }

        if (user.emailVerified) {
            return NextResponse.json({ error: 'Cet email est déjà vérifié.' }, { status: 400 });
        }

        // Delete existing tokens for this user
        await prisma.emailVerification.deleteMany({ where: { userId: user.id } });

        // Create new token
        const verification = await prisma.emailVerification.create({
            data: {
                userId: user.id,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            },
        });

        await sendVerificationEmail(email, user.name, verification.token);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Resend verification error:', error);
        return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
    }
}
