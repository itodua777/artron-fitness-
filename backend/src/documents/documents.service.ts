
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Doc, DocDocument } from './document.schema';

@Injectable()
export class DocumentsService {
    constructor(@InjectModel(Doc.name) private docModel: Model<DocDocument>) { }

    async create(createDocDto: any, tenantId: string): Promise<Doc> {
        const newDoc = new this.docModel({
            ...createDocDto,
            tenantId,
        });
        return newDoc.save();
    }

    async findAll(tenantId: string): Promise<Doc[]> {
        return this.docModel.find({ tenantId }).sort({ createdAt: -1 }).exec();
    }
}
