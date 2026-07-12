import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');
        const skip = (page - 1) * limit;

        const type = searchParams.get('type');
        const priceType = searchParams.get('priceType'); // 'free' | 'paid'
        const search = searchParams.get('search');
        const sortBy = searchParams.get('sortBy') || 'createdAt';
        const sortOrder = searchParams.get('sortOrder') || 'desc';

        const conditions: any[] = [{ status: 'APPROVED' }];

        if (type && type !== 'ALL') {
            conditions.push({
                OR: [
                    { type: type },
                    { type: 'BOTH' }
                ]
            });
        }
        if (priceType === 'free') {
            conditions.push({ price: { equals: 0 } });
        } else if (priceType === 'paid') {
            conditions.push({ price: { gt: 0 } });
        }
        if (search) {
            conditions.push({
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { address: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                ]
            });
        }

        const where: any = { AND: conditions };

        const orderBy: any = {};
        if (sortBy === 'price') {
            orderBy.price = sortOrder;
        } else if (sortBy === 'capacity') {
            orderBy.capacity = sortOrder;
        } else {
            orderBy.createdAt = sortOrder;
        }

        const [spots, total] = await Promise.all([
            prisma.spot.findMany({
                where,
                skip,
                take: limit,
                orderBy: [orderBy, { id: 'asc' }],
                include: {
                    host: {
                        select: { name: true },
                    },
                },
            }),
            prisma.spot.count({ where })
        ]);

        return NextResponse.json({
            spots,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        console.error('Error fetching spots:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        const body = await request.json();
        const { title, description, address, type, price, capacity, latitude, longitude } = body;

        if (!title || !address || !type || price === undefined || capacity === undefined || latitude === undefined || latitude === null || longitude === undefined || longitude === null) {
            return NextResponse.json({ error: 'Champs requis manquants (titre, adresse, type, prix, capacité, latitude, longitude)' }, { status: 400 });
        }

        const spot = await prisma.spot.create({
            data: {
                title,
                description,
                address,
                type,
                price: parseFloat(price),
                capacity: parseInt(capacity),
                latitude: latitude != null ? parseFloat(latitude) : null,
                longitude: longitude != null ? parseFloat(longitude) : null,
                hostId: session.user.id,
                status: 'PENDING',
            },
        });

        await prisma.user.update({
            where: { id: session.user.id },
            data: { role: session.user.role === 'ADMIN' ? 'ADMIN' : 'HOST' },
        });

        return NextResponse.json(spot, { status: 201 });
    } catch (error) {
        console.error('Error creating spot:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
