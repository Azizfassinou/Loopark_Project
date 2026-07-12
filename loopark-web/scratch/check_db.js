const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const spotCount = await prisma.spot.count();
    console.log(`Nombre de spots dans la base de données: ${spotCount}`);
    const users = await prisma.user.findMany({
        select: { email: true, name: true, role: true }
    });
    console.log('Utilisateurs:', users);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
