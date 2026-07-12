import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const token = searchParams.get('token');

        if (!token) {
            return NextResponse.json({ error: 'Token manquant' }, { status: 400 });
        }

        const verification = await prisma.emailVerification.findUnique({
            where: { token },
            include: { user: true },
        });

        if (!verification) {
            return NextResponse.json({ error: 'Lien invalide ou déjà utilisé' }, { status: 400 });
        }

        if (verification.expiresAt < new Date()) {
            // Clean up expired token
            await prisma.emailVerification.delete({ where: { token } });
            return NextResponse.json({ error: 'Ce lien a expiré. Veuillez en demander un nouveau.' }, { status: 400 });
        }

        // Mark email as verified + delete the token
        await prisma.$transaction([
            prisma.user.update({
                where: { id: verification.userId },
                data: { emailVerified: new Date() },
            }),
            prisma.emailVerification.delete({ where: { token } }),
        ]);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Email verification error:', error);
        return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
    }
}
