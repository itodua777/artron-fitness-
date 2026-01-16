import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDepartmentDto } from './dto/create-department.dto';

@Injectable()
export class DepartmentsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createDepartmentDto: CreateDepartmentDto) {
        return this.prisma.department.create({
            data: createDepartmentDto,
        });
    }

    async findAll() {
        return this.prisma.department.findMany({ include: { roles: true } });
    }
}
