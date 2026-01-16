
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Lead, LeadDocument } from './lead.schema';

@Injectable()
export class LeadsService {
    constructor(@InjectModel(Lead.name) private leadModel: Model<LeadDocument>) { }

    async create(email: string, source: string): Promise<Lead> {
        const lead = new this.leadModel({ email, source });
        return lead.save();
    }
}
