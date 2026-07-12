import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const spotId = searchParams.get('spotId');

        const conditions: any[] = [];

        // Rôles et restrictions d'accès aux réservations
        if (session.user.role === 'ADMIN') {
            // L'administrateur peut tout voir et filtrer à sa guise
            if (userId) conditions.push({ userId });
            if (spotId) conditions.push({ spotId });
        } else if (session.user.role === 'HOST') {
            // Un hôte peut voir ses propres réservations OU les réservations sur ses propres spots
            conditions.push({
                OR: [
                    { userId: session.user.id },
                    { spot: { hostId: session.user.id } }
                ]
            });

            if (userId) conditions.push({ userId });
            if (spotId) conditions.push({ spotId });
        } else {
            // Un utilisateur standard ne peut voir QUE ses propres réservations
            conditions.push({ userId: session.user.id });
            if (spotId) conditions.push({ spotId });
        }

        const bookings = await prisma.booking.findMany({
            where: conditions.length > 0 ? { AND: conditions } : {},
            include: {
                spot: {
                    include: {
                        host: {
                            select: {
                                name: true,
                                email: true,
                            }
                        }
                    }
                },
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const body = await request.json();
        const { spotId, startDate, endDate } = body;

        if (!spotId || !startDate || !endDate) {
            return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
        }

        // Vérification de l'existence du spot
        const spot = await prisma.spot.findUnique({
            where: { id: spotId },
        });

        if (!spot) {
            return NextResponse.json({ error: 'Spot introuvable' }, { status: 404 });
        }

        // Vérification complémentaire : l'hôte ne peut pas réserver son propre spot
        if (spot.hostId === session.user.id) {
            return NextResponse.json({ error: 'Vous ne pouvez pas réserver votre propre spot' }, { status: 400 });
        }

        // Validation des dates
        const start = new Date(startDate);
        const end = new Date(endDate);
        const now = new Date();

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return NextResponse.json({ error: 'Dates de réservation invalides' }, { status: 400 });
        }

        if (start < now) {
            return NextResponse.json({ error: 'La date de début ne peut pas être dans le passé' }, { status: 400 });
        }

        if (start >= end) {
            return NextResponse.json({ error: 'La date de fin doit être postérieure à la date de début' }, { status: 400 });
        }

        // Création de la réservation dans une transaction atomique pour éviter la race condition
        // sur la capacité (re-vérification du count à l'intérieur du lock)
        const booking = await prisma.$transaction(async (tx) => {
            const overlappingCount = await tx.booking.count({
                where: {
                    spotId,
                    status: { not: 'CANCELLED' },
                    startDate: { lt: end },
                    endDate: { gt: start },
                },
            });

            if (overlappingCount >= spot.capacity) {
                throw new Error('SPOT_FULL');
            }

            return tx.booking.create({
                data: {
                    userId: session.user.id,
                    spotId,
                    startDate: start,
                    endDate: end,
                    status: 'CONFIRMED',
                },
            });
        });

        return NextResponse.json(booking, { status: 201 });
    } catch (error: any) {
        if (error?.message === 'SPOT_FULL') {
            return NextResponse.json({
                error: 'Ce spot est complet pour le créneau horaire sélectionné',
            }, { status: 400 });
        }
        console.error('Error creating booking:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

