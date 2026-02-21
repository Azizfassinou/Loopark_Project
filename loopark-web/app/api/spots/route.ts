import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const spots = await prisma.spot.findMany({
            include: {
                host: {
                    select: {
                        name: true,
                    },
                },
            },
        });
        return NextResponse.json(spots);
    } catch (error) {
        console.error('Error fetching spots:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, description, address, type, price, capacity, latitude, longitude, hostId } = body;

        const spot = await prisma.spot.create({
            data: {
                title,
                description,
                address,
                type,
                price,
                capacity,
                latitude,
                longitude,
                hostId,
            },
        });

        return NextResponse.json(spot, { status: 201 });
    } catch (error) {
        console.error('Error creating spot:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
