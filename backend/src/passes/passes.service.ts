
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pass, PassDocument } from './pass.schema';

@Injectable()
export class PassesService {
    constructor(@InjectModel(Pass.name) private passModel: Model<PassDocument>) { }

    async findAll(tenantId: string): Promise<Pass[]> {
        return this.passModel.find({ tenantId, active: true }).exec();
    }

    async create(createPassDto: any, tenantId: string): Promise<Pass> {
        const pass = new this.passModel({ ...createPassDto, tenantId });
        return pass.save();
    }

    async update(id: string, updatePassDto: any): Promise<Pass> {
        return this.passModel.findByIdAndUpdate(id, updatePassDto, { new: true }).exec();
    }

    async findOne(id: string): Promise<Pass> {
        return this.passModel.findById(id).exec();
    }
}
