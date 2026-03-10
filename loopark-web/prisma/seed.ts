import "dotenv/config";
import { PrismaClient, MobilityType } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

const prisma = new PrismaClient({
    accelerateUrl: process.env.DATABASE_URL
}).$extends(withAccelerate())

async function main() {
    console.log('Cleaning database...')
    // Note: deleteMany might be restricted on some Accelerate/Free tiers if not using directUrl
    // but for seeding it should work if the DATABASE_URL has permissions.
    await (prisma as any).booking.deleteMany({})
    await (prisma as any).spot.deleteMany({})
    await (prisma as any).user.deleteMany({})

    console.log('Seeding database with Paris Open Data...')

    // Create a official Loopark Host User for these public spots
    const host = await (prisma as any).user.create({
        data: {
            email: 'paris@loopark.com',
            name: 'Ville de Paris',
            password: 'security_standard_2026',
        },
    })

    const spotsData = [
        { title: 'Station Suffren', address: '46 AV DE SUFFREN, Paris', capacity: 4, lat: 48.8537, lng: 2.2967, type: MobilityType.BIKE },
        { title: 'Station Luynes', address: '2 RUE DE LUYNES, Paris', capacity: 4, lat: 48.8554, lng: 2.3267, type: MobilityType.BIKE },
        { title: 'Station Volontaires', address: '37 RUE DES VOLONTAIRES, Paris', capacity: 4, lat: 48.8405, lng: 2.3086, type: MobilityType.BIKE },
        { title: 'Station Jobbe Duval', address: '14 RUE JOBBE DUVAL, Paris', capacity: 4, lat: 48.8345, lng: 2.2987, type: MobilityType.BIKE },
        { title: 'Station Galilee', address: '39 RUE GALILEE, Paris', capacity: 4, lat: 48.8702, lng: 2.2965, type: MobilityType.BIKE },
        { title: 'Parking Truffaut', address: '20 RUE FRANCOIS TRUFFAUT, Paris', capacity: 20, lat: 48.8329, lng: 2.3854, type: MobilityType.BIKE },
        { title: 'Station Liancourt', address: '15 RUE LIANCOURT, Paris', capacity: 4, lat: 48.8333, lng: 2.3275, type: MobilityType.BIKE },
        { title: 'Station Paul Valery', address: '23 RUE PAUL VALERY, Paris', capacity: 4, lat: 48.8705, lng: 2.2895, type: MobilityType.BIKE },
        { title: 'Parking Turin', address: '34 RUE DE TURIN, Paris', capacity: 4, lat: 48.8822, lng: 2.3244, type: MobilityType.BIKE },
        { title: 'Station Saint-Simon', address: '3 RUE DE SAINT-SIMON, Paris', capacity: 4, lat: 48.8564, lng: 2.3241, type: MobilityType.BIKE },
        { title: 'Station Wallons', address: '27 RUE DES WALLONS, Paris', capacity: 5, lat: 48.8382, lng: 2.3584, type: MobilityType.BIKE },
        { title: 'Parking Belleville', address: '23 BD DE BELLEVILLE, Paris', capacity: 10, lat: 48.8682, lng: 2.3814, type: MobilityType.BIKE },
        { title: 'Mégastation Port-Royal', address: '36 BD DE PORT-ROYAL, Paris', capacity: 48, lat: 48.8372, lng: 2.3481, type: MobilityType.BIKE },
    ]

    for (const spot of spotsData) {
        await (prisma as any).spot.create({
            data: {
                title: spot.title,
                description: `Emplacement de stationnement vélo ${spot.capacity > 10 ? 'haute capacité' : 'sécurisé'} situé au ${spot.address}. Accessibilité 24/7.`,
                address: spot.address,
                capacity: spot.capacity,
                price: 0, // Mark as free as per spreadsheet "Gratuit"
                type: spot.type,
                latitude: spot.lat,
                longitude: spot.lng,
                hostId: host.id,
            },
        })
    }

    console.log('Seeding finished successfully.')
}

main()
    .then(async () => {
        await (prisma as any).$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        // @ts-ignore
        await prisma.$disconnect()
        process.exit(1)
    })
