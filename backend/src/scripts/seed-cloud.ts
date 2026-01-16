
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UserService } from '../user/user.service';
import { MembersService } from '../members/members.service';
import { CorporateService } from '../corporate/corporate.service';
import { Types } from 'mongoose';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const userService = app.get(UserService);
    const membersService = app.get(MembersService);
    const corporateService = app.get(CorporateService);

    console.log('Seeding Users...');
    const users = [
        {
            firstname: 'David',
            lastname: 'Builder',
            role: 'Super Admin',
            password: 'password123',
            email: 'david@builder.com',
            IdCard: '01010101010',
            mobile: '555-0001',
        },
        {
            firstname: 'Sarah',
            lastname: 'Designer',
            role: 'Manager',
            password: 'password123',
            email: 'sarah@design.com',
            IdCard: '02020202020',
            mobile: '555-0002',
        },
        {
            firstname: 'Giorgi',
            lastname: 'Old',
            role: 'Staff',
            password: 'password123',
            email: 'giorgi@old.com',
            IdCard: '03030303030',
            mobile: '555-0003',
        },
    ];

    for (const user of users) {
        // Check if user exists to avoid duplicates
        const existingUsers = await userService.getUsers();
        const exists = existingUsers.find(u => u.email === user.email);
        if (!exists) {
            await userService.createUser(user);
            console.log(`Created user: ${user.firstname} ${user.lastname}`);
        } else {
            console.log(`User ${user.email} already exists.`);
        }
    }

    console.log('Seeding Members...');
    const members = [
        {
            name: 'John Doe',
            email: 'john@example.com',
            phone: '555-0101',
            personalId: '01010101010',
            status: 'Active',
            joinedDate: new Date().toISOString(),
            isCorporate: false,
        },
        {
            name: 'Jane Smith',
            email: 'jane@example.com',
            phone: '555-0202',
            personalId: '02020202020',
            status: 'Active',
            joinedDate: new Date().toISOString(),
            isCorporate: true,
            companyName: 'Tech Corp',
        },
    ];

    const tenantId = new Types.ObjectId().toString();

    for (const member of members) {
        // Very basic check, mainly to prevent massive dupes if run twice quickly
        const allMembers = await membersService.findAll(tenantId);
        const exists = allMembers.find(m => m.personalId === member.personalId);

        if (!exists) {
            await membersService.create(member, tenantId);
            console.log(`Created member: ${member.name}`);
        } else {
            console.log(`Member ${member.name} already exists.`);
        }
    }

    console.log('Seeding Corporate Data...');
    const partners = [
        {
            name: 'Fit Corp',
            identCode: '123456789',
            contactPerson: 'Alice Fit',
            contactEmail: 'alice@fitcorp.com',
            category: 'PARTNER',
            // fields not in Schema or Optional
            // contractStartDate: new Date().toISOString(),
            // contractEndDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
            status: 'Active',
        },
    ];

    for (const partner of partners) {
        const allCorp = await corporateService.findAll();
        const exists = allCorp.find(c => c.identCode === partner.identCode);
        if (!exists) {
            await corporateService.create(partner);
            console.log(`Created partner: ${partner.name}`);
        } else {
            console.log(`Partner ${partner.name} already exists.`);
        }
    }

    console.log('Seeding complete!');
    await app.close();
}

bootstrap();
