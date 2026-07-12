import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const spot = await prisma.spot.findUnique({
            where: { id },
            include: {
                host: {
                    select: { name: true, email: true },
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

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.id || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
        }

        const { id } = await params;
        const body = await request.json();
        const { status, rejectionReason } = body;

        if (!['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
            return NextResponse.json({ error: 'Statut invalide' }, { status: 400 });
        }

        const spot = await prisma.spot.update({
            where: { id },
            data: {
                status,
                rejectionReason: status === 'REJECTED' ? rejectionReason : null,
            },
        });

        return NextResponse.json(spot);
    } catch (error) {
        console.error('Error updating spot:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
