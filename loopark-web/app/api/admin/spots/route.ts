import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status') || 'PENDING';

        const spots = await prisma.spot.findMany({
            where: { status: status as any },
            include: {
                host: {
                    select: { name: true, email: true },
                },
                _count: {
                    select: { bookings: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        const counts = await prisma.spot.groupBy({
            by: ['status'],
            _count: { _all: true },
        });

        return NextResponse.json({ spots, counts });
    } catch (error) {
        console.error('Error fetching admin spots:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
        }

        const body = await request.json();
        const { spotId, status, rejectionReason } = body;

        if (!spotId || !status) {
            return NextResponse.json({ error: 'spotId et status requis' }, { status: 400 });
        }

        const validStatuses = ['APPROVED', 'REJECTED', 'PENDING'];
        if (!validStatuses.includes(status)) {
            return NextResponse.json({ error: 'Statut invalide' }, { status: 400 });
        }

        const spot = await prisma.spot.update({
            where: { id: spotId },
            data: {
                status,
                rejectionReason: status === 'REJECTED' ? (rejectionReason ?? null) : null,
            },
        });

        return NextResponse.json(spot);
    } catch (error) {
        console.error('Error updating spot status:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
