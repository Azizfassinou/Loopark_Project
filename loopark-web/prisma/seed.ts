import "dotenv/config";
import { PrismaClient, MobilityType } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const connectionString = `${process.env.DATABASE_URL}`
const pool = new pg.Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    // Clear existing data
    await prisma.booking.deleteMany({})
    await prisma.spot.deleteMany({})
    await prisma.user.deleteMany({})

    console.log('Seeding database...')

    // Create a Host User
    const host = await prisma.user.create({
        data: {
            email: 'host@loopark.com',
            name: 'Jean Hôte',
            password: 'password123', // In a real app, this would be hashed
        },
    })

    // Create a Regular User
    const user = await prisma.user.create({
        data: {
            email: 'user@loopark.com',
            name: 'Alice Cycliste',
            password: 'password123',
        },
    })

    // Create some Spots
    await prisma.spot.create({
        data: {
            title: 'Garage sécurisé - Centre Ville',
            description: 'Un garage fermé et surveillé, parfait pour les vélos électriques.',
            address: '10 Rue de la République, Lyon',
            type: MobilityType.BIKE,
            price: 1.5,
            capacity: 5,
            latitude: 45.7640,
            longitude: 4.8357,
            hostId: host.id,
        },
    })

    await prisma.spot.create({
        data: {
            title: 'Point d\'attache couvert - Gare Part-Dieu',
            description: 'Emplacement abrité avec arceau solide.',
            address: 'Place Charles Béraudier, Lyon',
            type: MobilityType.BOTH,
            price: 1.0,
            capacity: 10,
            latitude: 45.7606,
            longitude: 4.8592,
            hostId: host.id,
        },
    })

    await prisma.spot.create({
        data: {
            title: 'Espace Trottinettes - Vieux Lyon',
            description: 'Petit espace optimisé pour les trottinettes électriques.',
            address: '5 Rue Saint-Jean, Lyon',
            type: MobilityType.SCOOTER,
            price: 0.8,
            capacity: 3,
            latitude: 45.7624,
            longitude: 4.8275,
            hostId: host.id,
        },
    })

    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
