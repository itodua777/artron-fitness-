import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMemberDto } from './dto/create-member.dto';

@Injectable()
export class MembersService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createMemberDto: CreateMemberDto) {
        return this.prisma.member.create({
            data: createMemberDto,
        });
    }

    async findAll(branchId?: string) {
        const where = branchId ? { branchId } : {};
        return this.prisma.member.findMany({
            where,
            include: { branch: true }
        });
    }

    async findOne(id: string) {
        return this.prisma.member.findUnique({
            where: { id },
            include: { branch: true }
        });
    }

    async update(id: string, updateMemberDto: Partial<CreateMemberDto>) {
        return this.prisma.member.update({
            where: { id },
            data: updateMemberDto,
        });
    }

    async remove(id: string) {
        return this.prisma.member.delete({
            where: { id },
        });
    }
}
