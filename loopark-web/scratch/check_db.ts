import "dotenv/config";
import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

const prisma = new PrismaClient({
    accelerateUrl: process.env.DATABASE_URL
}).$extends(withAccelerate())

async function main() {
    const spotCount = await (prisma as any).spot.count();
    console.log(`Nombre de spots dans la base de données: ${spotCount}`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await (prisma as any).$disconnect());
