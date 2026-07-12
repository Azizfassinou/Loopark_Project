import "dotenv/config";
import { PrismaClient, MobilityType } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';

const pool = new Pool({ connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Starting seed process...');

    // ---------------------------------------------------------------
    // 1️⃣   Ensure we have a host
    // ---------------------------------------------------------------
    let host = await (prisma as any).user.findUnique({
        where: { email: 'paris@loopark.com' },
    });

    if (!host) {
        console.log('Creating official host...');
        host = await (prisma as any).user.create({
            data: {
                email: 'paris@loopark.com',
                name: 'Ville de Paris',
                firstName: 'Ville',
                lastName: 'de Paris',
                emailVerified: new Date(),
                password: 'security_standard_2026', // placeholder (hash it in prod)
            },
        });
    }

    // ---------------------------------------------------------------
    // 2️⃣   Create an ADMIN account if none exists
    // ---------------------------------------------------------------
    const existingAdmin = await (prisma as any).user.findFirst({
        where: { role: 'ADMIN' },
    });

    if (!existingAdmin) {
        console.log('✅ No admin found – creating default admin');
        await (prisma as any).user.create({
            data: {
                email: 'admin@loopark.com',
                name: 'Admin Loopark',
                firstName: 'Admin',
                lastName: 'Loopark',
                password: 'admin12345',          // plain for seed only
                emailVerified: new Date(),
                role: 'ADMIN',
            },
        });
    } else {
        console.log('✅ Admin already exists →', {
            id: existingAdmin.id,
            email: existingAdmin.email,
        });
    }

    const csvFilePath = path.resolve(process.cwd(), 'data.csv');
    const results: any[] = [];

    console.log(`Reading CSV from: ${csvFilePath}`);

    await new Promise((resolve, reject) => {
        fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', async () => {
                console.log(`Read ${results.length} rows from CSV.`);

                // Clean existing spots for this host
                console.log('Cleaning existing spots for this host...');
                await (prisma as any).spot.deleteMany({
                    where: { hostId: host.id },
                });

                console.log('Importing spots in batches...');
                const BATCH_SIZE = 100;
                for (let i = 0; i < results.length; i += BATCH_SIZE) {
                    const batch = results.slice(i, i + BATCH_SIZE);
                    const spotsToCreate = batch.map((row) => {
                        const coords = row['geo_point_2d']
                            ? row['geo_point_2d'].split(',').map((c: string) => parseFloat(c.trim()))
                            : [null, null];

                        // Map mobility type
                        let mobilityType: MobilityType = MobilityType.BIKE;
                        const regime = (row['Régime particulier'] || '').toLowerCase();
                        if (regime.includes('trottinette')) {
                            mobilityType = MobilityType.SCOOTER;
                        } else if (regime.includes('mixte') || regime.includes('vélos')) {
                            mobilityType = MobilityType.BIKE;
                        }

                        return {
                            title: row['Adresse complète']
                                ? `Station ${row['Adresse complète'].split(' ').slice(1).join(' ')}`
                                : 'Station Loopark',
                            description: `${row['Type mobilier'] || 'Arceau'} - ${row['Régime particulier'] || 'Vélos'}`,
                            address: row['Adresse complète'] || 'Adresse inconnue',
                            capacity: parseInt(row['Nombre places calculées']) || 1,
                            price: row['Tarif'] === 'Gratuit' ? 0 : 1.0,
                            type: mobilityType,
                            latitude: coords[0],
                            longitude: coords[1],
                            hostId: host.id,
                            status: 'APPROVED',
                        };
                    });

                    await (prisma as any).spot.createMany({
                        data: spotsToCreate,
                        skipDuplicates: true,
                    });

                    if ((i + BATCH_SIZE) % 1000 === 0 || i + BATCH_SIZE >= results.length) {
                        console.log(`Processed ${Math.min(i + BATCH_SIZE, results.length)} / ${results.length} spots...`);
                    }
                }

                console.log('Seeding finished successfully.');
                resolve(true);
            })
            .on('error', (error) => {
                console.error('Error reading CSV:', error);
                reject(error);
            });
    });
}

main()
    .then(async () => {
        await prisma.$disconnect();
        await pool.end();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        await pool.end();
        process.exit(1);
    });
