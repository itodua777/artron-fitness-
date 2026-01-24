
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding members...');

    // Try to find existing company first to avoid duplicates or creating new ones strictly
    let company = await prisma.company.findFirst({
        include: { branches: true }
    });

    if (!company) {
        company = await prisma.company.create({
            data: {
                name: 'Test Company',
                branches: {
                    create: {
                        name: 'Main Branch'
                    }
                }
            },
            include: { branches: true }
        });
    }

    const branchId = company.branches[0].id;

    await prisma.member.createMany({
        data: [
            {
                name: 'გიორგი გიორგაძე',
                phone: '555123456',
                email: 'giorgi@example.com',
                personalId: '01010101010',
                status: 'Active',
                branchId: branchId
            },
            {
                name: 'ნინო ნინიძე',
                phone: '599987654',
                email: 'nino@example.com',
                personalId: '20202020202',
                status: 'Active',
                branchId: branchId
            }
        ]
    });

    console.log('Seeding completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
