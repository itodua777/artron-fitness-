
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WarehouseItem, WarehouseItemDocument } from './warehouse-item.schema';

@Injectable()
export class WarehouseService {
    constructor(@InjectModel(WarehouseItem.name) private itemModel: Model<WarehouseItemDocument>) { }

    async create(data: any, tenantId: string) {
        const newItem = new this.itemModel({ ...data, tenantId });
        return newItem.save();
    }

    async findAll(tenantId: string, category?: string) {
        const filter: any = { tenantId };
        if (category) {
            filter.category = category;
        }
        return this.itemModel.find(filter).sort({ createdAt: -1 }).exec();
    }

    async update(id: string, data: any) {
        return this.itemModel.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    async delete(id: string) {
        return this.itemModel.findByIdAndDelete(id).exec();
    }
}
