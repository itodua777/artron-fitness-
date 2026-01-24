
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Check specifically for the user reported in credentials.md
    const user = await prisma.user.findUnique({
        where: { email: 'galileotest@gmail.com' },
    });

    if (user) {
        console.log('User found:', JSON.stringify(user, null, 2));
    } else {
        console.log('User galileotest@gmail.com NOT found.');
        // List all users to see if anyone exists
        const count = await prisma.user.count();
        console.log(`Total users in DB: ${count}`);
        const allUsers = await prisma.user.findMany({ select: { email: true } });
        console.log('Existing emails:', allUsers.map(u => u.email));
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
