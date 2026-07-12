import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, firstName, lastName } = body;

        if (!email || !password) {
            return NextResponse.json({ error: 'Email et mot de passe requis' }, { status: 400 });
        }
        // Validation du format email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: 'Format d\'email invalide' }, { status: 400 });
        }
        if (!firstName?.trim() || !lastName?.trim()) {
            return NextResponse.json({ error: 'Prénom et nom requis' }, { status: 400 });
        }
        if (password.length < 8) {
            return NextResponse.json({ error: 'Le mot de passe doit contenir au moins 8 caractères' }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ error: 'Un compte existe déjà avec cet email' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const fullName = `${firstName.trim()} ${lastName.trim()}`;

        // Create user (emailVerified = null = unverified)
        const user = await prisma.user.create({
            data: {
                email,
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                name: fullName,
                password: hashedPassword,
            },
        });

        // Generate verification token (expires in 24h)
        const verification = await prisma.emailVerification.create({
            data: {
                userId: user.id,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            },
        });

        // Send email (non-blocking)
        try {
            await sendVerificationEmail(email, firstName.trim(), verification.token);
        } catch (emailError) {
            console.error('[Register] Email send failed:', emailError);
            // Return error to client so they know email wasn't sent
            return NextResponse.json({ error: 'Échec de l\'envoi de l\'email de vérification' }, { status: 500 });
        }

        const { password: _, ...userWithoutPassword } = user;
        return NextResponse.json({ ...userWithoutPassword, emailSent: true }, { status: 201 });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
    }
}
