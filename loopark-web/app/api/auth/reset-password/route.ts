import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const { token, password } = await request.json();

        if (!token || !password) {
            return NextResponse.json({ error: 'Token et mot de passe requis' }, { status: 400 });
        }

        const resetToken = await prisma.passwordResetToken.findUnique({
            where: { token },
            include: { user: true },
        });

        if (!resetToken) {
            return NextResponse.json({ error: 'Lien invalide ou expiré' }, { status: 400 });
        }

        if (resetToken.expiresAt < new Date()) {
            await prisma.passwordResetToken.delete({ where: { id: resetToken.id } });
            return NextResponse.json({ error: 'Le lien a expiré' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.$transaction([
            prisma.user.update({
                where: { id: resetToken.userId },
                data: { password: hashedPassword },
            }),
            prisma.passwordResetToken.delete({ where: { id: resetToken.id } }),
        ]);

        return NextResponse.json({ message: 'Mot de passe mis à jour avec succès' });
    } catch (error) {
        console.error('Password reset error:', error);
        return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
    }
}
