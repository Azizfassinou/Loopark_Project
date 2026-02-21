import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;

        const spot = await prisma.spot.findUnique({
            where: { id },
            include: {
                host: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        });

        if (!spot) {
            return NextResponse.json({ error: 'Spot not found' }, { status: 404 });
        }

        return NextResponse.json(spot);
    } catch (error) {
        console.error('Error fetching spot:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
