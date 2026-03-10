import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

const prismaClientSingleton = () => {
    return new PrismaClient({
        accelerateUrl: process.env.DATABASE_URL
    }).$extends(withAccelerate())
}

type PrismaClientExtended = ReturnType<typeof prismaClientSingleton>

declare global {
    var prisma: undefined | PrismaClientExtended
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
