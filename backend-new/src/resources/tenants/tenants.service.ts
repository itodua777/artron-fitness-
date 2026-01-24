import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TenantsService {
    constructor(private prisma: PrismaService) { }

    async findOne(id: string) {
        const company = await this.prisma.company.findUnique({
            where: { id },
            // We'll try to find a director if possible via linked branches/users, 
            // but for now let's just return company info.
            // The frontend uses "directorName" etc. 
            // We might need to fetch the main branch -> users -> find one with "Director" role or implicit logic.
            // For simple onboarding, the director was created during registration.
        });

        if (!company) {
            throw new NotFoundException(`Tenant with ID ${id} not found`);
        }

        // Try to find the director (User created with Company)
        // Heuristic: Find user in this company's branches that has no role or specific role?
        // Or find the user created at same time? 
        // Better: let's query the specific director if we can. 
        // Since we don't store directorId on Company directly in Prisma Schema (we saw earlier),
        // we have to infer it. 
        // For now, let's fetch the FIRST user of the company (likely the director).

        const mainBranch = await this.prisma.branch.findFirst({
            where: { companyId: id },
            include: { users: { orderBy: { createdAt: 'asc' }, take: 1 } }
        });

        const director = mainBranch?.users?.[0];

        return {
            _id: company.id, // Frontend expects underscore ID sometimes or just id? mappedData logic used id.
            id: company.id,
            name: company.name,
            identCode: company.identCode,
            legalAddress: company.legalAddress,
            activityField: company.activityField,
            brandName: company.brandName,
            logo: company.logo,

            // Map Director info
            directorName: director ? `${director.firstName} ${director.lastName}` : '',
            directorEmail: director?.email || '',
            directorPhone: director?.phone || '',

            // Mock other fields for now or leave empty
            companyEmail: '',
            companyPhone: '',
        };
    }
}
