import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePassDto } from './dto/create-pass.dto';

@Injectable()
export class PassesService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createPassDto: CreatePassDto) {
        return this.prisma.pass.create({
            data: createPassDto,
        });
    }

    async findAll(branchId?: string) {
        const where = branchId ? { branchId } : {};
        return this.prisma.pass.findMany({
            where,
            include: { branch: true }
        });
    }

    async findOne(id: string) {
        return this.prisma.pass.findUnique({
            where: { id },
            include: { branch: true }
        });
    }

    async update(id: string, updatePassDto: Partial<CreatePassDto>) {
        return this.prisma.pass.update({
            where: { id },
            data: updatePassDto,
        });
    }

    async remove(id: string) {
        return this.prisma.pass.delete({
            where: { id },
        });
    }
}
