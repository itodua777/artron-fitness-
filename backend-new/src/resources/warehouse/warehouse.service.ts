import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WarehouseService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createDto: any) {
        // If it's a supplier
        if (createDto.category === 'SUPPLIER') {
            return this.prisma.supplier.create({
                data: {
                    name: createDto.name,
                    contactPerson: createDto.contactPerson,
                    phone: createDto.phone,
                    category: 'General',
                    status: createDto.status || 'Active'
                }
            });
        }

        // If it's an item (GROCERY, MATERIAL, ACCESSORY)
        // Map frontend 'stock' to 'quantity' if necessary, but frontend sends 'quantity' for createItem payload?
        // In Page.tsx:
        // Grocery: quantity: parseInt(newGrocery.stock) -> mapped to 'quantity' property in payload. Good.
        // Material: quantity: parseInt(newMaterial.quantity) -> mapped to 'quantity'. Good.

        return this.prisma.warehouseItem.create({
            data: {
                name: createDto.name,
                category: createDto.category,
                quantity: createDto.quantity,
                price: createDto.price,
                weight: createDto.weight,
                unit: createDto.unit,
                condition: createDto.condition,
                note: createDto.note, // 'note' was used for sub-category/note in frontend logic
                supplierId: createDto.supplier || undefined,
                deliveryDate: createDto.deliveryDate ? new Date(createDto.deliveryDate) : undefined,
            },
        });
    }

    async findAll(category: string) {
        if (category === 'SUPPLIER') {
            return this.prisma.supplier.findMany({ orderBy: { createdAt: 'desc' } });
        }
        return this.prisma.warehouseItem.findMany({
            where: { category },
            orderBy: { createdAt: 'desc' },
            include: { supplier: true }
        });
    }

    async remove(id: string) {
        try {
            // Try deleting item
            return await this.prisma.warehouseItem.delete({ where: { id } });
        } catch {
            // If fail, try deleting supplier
            try {
                return await this.prisma.supplier.delete({ where: { id } });
            } catch (e) {
                throw new Error('Item or Supplier not found');
            }
        }
    }
}
