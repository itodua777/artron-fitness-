
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const branches = await prisma.branch.findMany();
    console.log('Branches:', branches);

    const roles = await prisma.role.findMany();
    console.log('Roles:', roles);

    const companies = await prisma.company.findMany();
    console.log('Companies:', companies);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
