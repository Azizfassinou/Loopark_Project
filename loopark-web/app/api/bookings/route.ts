import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const spotId = searchParams.get('spotId');

        const where: any = {};
        if (userId) where.userId = userId;
        if (spotId) where.spotId = spotId;

        const bookings = await prisma.booking.findMany({
            where,
            include: {
                spot: true,
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
        const body = await request.json();
        const { userId, spotId, startDate, endDate } = body;

        if (!userId || !spotId || !startDate || !endDate) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check if spot exists
        const spot = await prisma.spot.findUnique({
            where: { id: spotId },
        });

        if (!spot) {
            return NextResponse.json({ error: 'Spot not found' }, { status: 404 });
        }

        // Create the booking
        const booking = await prisma.booking.create({
            data: {
                userId,
                spotId,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                status: 'PENDING',
            },
        });

        return NextResponse.json(booking, { status: 201 });
    } catch (error) {
        console.error('Error creating booking:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
