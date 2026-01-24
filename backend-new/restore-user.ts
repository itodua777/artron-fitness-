
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const email = 'galileotest@gmail.com';
    const passwordText = 'md0t5krj';
    // Using the confirmed existing branch ID for "ჭომა"
    const branchId = '5866c5c0-8851-4397-b2cd-36a54a953ea2';

    console.log(`Starting restoration for ${email}...`);

    // 1. Ensure Branch exists
    const branch = await prisma.branch.findUnique({ where: { id: branchId } });
    if (!branch) {
        // Fallback: search for any branch if intended one is missing
        const anyBranch = await prisma.branch.findFirst();
        if (!anyBranch) throw new Error('No branches found in DB. Cannot create user.');
        console.log('Target branch not found, using first available:', anyBranch.name);
        // We'd update branchId here if we were using `let`, but for now let's error if the specific one is missing 
        // or assume the user knows what they are doing. 
        // Actually, let's better just fail if specific one is missing to avoid data pollution.
        throw new Error(`Target branch ${branchId} not found.`);
    }
    console.log('Using Branch:', branch.name);

    // 2. Ensure Department exists
    let dept = await prisma.department.findFirst({ where: { branchId } });
    if (!dept) {
        dept = await prisma.department.create({
            data: { name: 'Administration', branchId }
        });
        console.log('Created Department:', dept.name);
    } else {
        console.log('Using Department:', dept.name);
    }

    // 3. Ensure Role exists
    let role = await prisma.role.findFirst({ where: { name: 'DIRECTOR', departmentId: dept.id } });
    if (!role) {
        role = await prisma.role.create({
            data: { name: 'DIRECTOR', departmentId: dept.id }
        });
        console.log('Created Role:', role.name);
    } else {
        console.log('Using Role:', role.name);
    }

    // 4. Create/Update User
    const hashedPassword = await bcrypt.hash(passwordText, 10);

    const user = await prisma.user.upsert({
        where: { email },
        update: {
            password: hashedPassword,
            roleId: role.id,
            branchId: branchId,
            // Update name just in case
            firstName: 'ბიძინა',
            lastName: 'თაბაგარი',
        },
        create: {
            email,
            password: hashedPassword,
            firstName: 'ბიძინა',
            lastName: 'თაბაგარი',
            branchId,
            roleId: role.id
        }
    });

    console.log('User successfully restored/updated:');
    console.log(`Email: ${user.email}`);
    console.log(`Password: ${passwordText}`);
    console.log(`Role: ${role.name}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
