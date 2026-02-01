import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: any) {
        // data: { name, totalCost, ingredients: [{ groceryId, quantity, unit, calculatedCost }] }

        return this.prisma.product.create({
            data: {
                name: data.name,
                totalCost: data.totalCost,
                ingredients: {
                    create: data.ingredients.map((ing: any) => ({
                        warehouseItemId: ing.groceryId,
                        quantity: ing.quantity,
                        unit: ing.unit,
                        calculatedCost: ing.calculatedCost
                    }))
                }
            },
            include: {
                ingredients: {
                    include: {
                        warehouseItem: true
                    }
                }
            }
        });
    }

    async findAll() {
        return this.prisma.product.findMany({
            include: {
                ingredients: {
                    include: {
                        warehouseItem: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async remove(id: string) {
        return this.prisma.product.delete({ where: { id } });
    }
}
