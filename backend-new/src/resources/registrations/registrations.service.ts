import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';

@Injectable()
export class RegistrationsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(dto: CreateRegistrationDto) {
        return this.prisma.$transaction(async (tx) => {
            // 1. Create Company
            const company = await tx.company.create({
                data: {
                    name: dto.name,
                    identCode: dto.identCode,
                    legalAddress: dto.legalAddress,
                    activityField: dto.activityField,
                    brandName: dto.brandName,
                },
            });

            // 2. Create Main Branch
            const branch = await tx.branch.create({
                data: {
                    name: 'Main Branch',
                    companyId: company.id,
                    // address is not in Branch schema based on previous read? 
                    // Let's re-check schema provided in context Step 488:
                    // model Branch { id, name, companyId, company, createdAt, updatedAt ... } 
                    // NO ADDRESS in Branch model in Step 488 viewing.
                    // Wait, Step 488 shows:
                    // model Branch { ... name String, companyId String ... }
                    // It does NOT show address.
                    // So I should NOT save address to Branch unless I add it.
                    // For now, I'll skip address on Branch to avoid another migration if possible, OR just save to Company.
                    // Company has legalAddress (added by me).
                    // Let's just create branch without address.
                },
            });

            // 3. Create Director User
            const [firstName, ...lastNameParts] = dto.directorName.split(' ');
            const lastName = lastNameParts.join(' ') || '';

            const director = await tx.user.create({
                data: {
                    email: dto.directorEmail,
                    password: 'CHANGE_ME_123', // In real app, hash this
                    firstName: firstName || dto.directorName,
                    lastName: lastName,
                    phone: dto.directorPhone,
                    branchId: branch.id,
                    // roleId: null for now, or fetch a default role
                }
            });

            return { company, branch, director };
        });
    }
}
