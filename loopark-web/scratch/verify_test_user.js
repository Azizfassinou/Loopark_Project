const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
    try {
        await prisma.user.update({
            where: { email: 'testuser@example.com' },
            data: { emailVerified: new Date() }
        });
        console.log("Verified testuser@example.com successfully!");
    } catch (e) {
        console.error("Error verifying test user:", e.message);
    } finally {
        await prisma.$disconnect();
    }
}
run();
