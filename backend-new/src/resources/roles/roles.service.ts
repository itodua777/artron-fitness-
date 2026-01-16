import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RolesService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createRoleDto: CreateRoleDto) {
        const { permissions, ...roleData } = createRoleDto;

        // Transactional create
        return this.prisma.role.create({
            data: {
                ...roleData,
                permissions: {
                    create: permissions.map((p) => ({
                        action: p.action,
                        subject: p.subject,
                        conditions: p.conditions as unknown as Prisma.InputJsonValue,
                        fields: p.fields as unknown as Prisma.InputJsonValue,
                        inverted: p.inverted ?? false,
                    })),
                },
            },
            include: {
                permissions: true,
            },
        });
    }

    async findAll() {
        return this.prisma.role.findMany({ include: { permissions: true } });
    }

    async findOne(id: string) {
        return this.prisma.role.findUnique({
            where: { id },
            include: { permissions: true },
        });
    }
}
