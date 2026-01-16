
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Corporate, CorporateDocument } from './corporate.schema';

@Injectable()
export class CorporateService {
    constructor(@InjectModel(Corporate.name) private corporateModel: Model<CorporateDocument>) { }

    async findAll(category?: 'PARTNER' | 'CLIENT'): Promise<Corporate[]> {
        const filter = category ? { category } : {};
        return this.corporateModel.find(filter).exec();
    }

    async create(createCorporateDto: any): Promise<Corporate> {
        const createdCorporate = new this.corporateModel(createCorporateDto);
        return createdCorporate.save();
    }
}
