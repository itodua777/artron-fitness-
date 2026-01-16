import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { RegisterCompanyDto } from './dto/register-company.dto';
import { Prisma } from '@prisma/client';


@Injectable()
export class CompaniesService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createCompanyDto: CreateCompanyDto) {
        return this.prisma.company.create({
            data: createCompanyDto,
        });
    }

    async register(dto: RegisterCompanyDto) {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(dto.password, salt);

        return this.prisma.$transaction(async (tx) => {
            // 1. Create Company
            const company = await tx.company.create({
                data: { name: dto.companyName },
            });

            // 2. Create Branch
            const branch = await tx.branch.create({
                data: {
                    name: dto.branchName,
                    companyId: company.id,
                },
            });

            // 3. Create Department
            const department = await tx.department.create({
                data: {
                    name: dto.departmentName,
                    branchId: branch.id,
                },
            });

            // 4. Create Role with Permissions
            const role = await tx.role.create({
                data: {
                    name: dto.roleName,
                    departmentId: department.id,
                    permissions: {
                        create: dto.permissions.map((p) => ({
                            action: p.action,
                            subject: p.subject,
                            conditions: p.conditions as any, // Cast for Prisma types
                            fields: p.fields as any,
                            inverted: p.inverted ?? false,
                        })),
                    },
                },
            });

            // 5. Create User
            const user = await tx.user.create({
                data: {
                    email: dto.email,
                    password: hashedPassword,
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                    phone: dto.phone,
                    branchId: branch.id,
                    roleId: role.id,
                },
            });

            return {
                company,
                branch,
                department,
                role,
                user: { ...user, password: undefined }, // Exclude password from response
            };
        });
    }

    async findAll() {
        return this.prisma.company.findMany({ include: { branches: true } });
    }
}
