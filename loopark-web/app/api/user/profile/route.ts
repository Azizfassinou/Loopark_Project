import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function PATCH(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        const body = await request.json();
        const { firstName, lastName, currentPassword, newPassword } = body;

        if (!firstName?.trim() || !lastName?.trim()) {
            return NextResponse.json({ error: 'Prénom et nom requis' }, { status: 400 });
        }

        const fullName = `${firstName.trim()} ${lastName.trim()}`;
        const updateData: Record<string, any> = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            name: fullName,
        };

        if (newPassword) {
            if (!currentPassword) {
                return NextResponse.json({ error: 'Le mot de passe actuel est requis' }, { status: 400 });
            }
            if (newPassword.length < 8) {
                return NextResponse.json({ error: 'Le nouveau mot de passe doit contenir au moins 8 caractères' }, { status: 400 });
            }

            const user = await prisma.user.findUnique({
                where: { id: session.user.id },
                select: { password: true },
            });

            if (!user?.password) {
                return NextResponse.json({ error: 'Impossible de changer le mot de passe' }, { status: 400 });
            }

            const isValid = await bcrypt.compare(currentPassword, user.password);
            if (!isValid) {
                return NextResponse.json({ error: 'Mot de passe actuel incorrect' }, { status: 400 });
            }

            updateData.password = await bcrypt.hash(newPassword, 12);
        }

        await prisma.user.update({
            where: { id: session.user.id },
            data: updateData,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating profile:', error);
        return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
    }
}
