
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Visit, VisitDocument } from './visit.schema';
import { Pass, PassDocument } from '../passes/pass.schema';

@Injectable()
export class VisitsService {
    constructor(
        @InjectModel(Visit.name) private visitModel: Model<VisitDocument>,
        @InjectModel(Pass.name) private passModel: Model<PassDocument>,
    ) { }

    async checkIn(data: any, tenantId: string) {
        // 1. Get the pass/activity
        const pass = await this.passModel.findById(data.passId).exec();
        if (!pass) throw new NotFoundException('Activity/Pass not found');

        // 2. Validate Capacity for Group/Scheduled Activities
        // Logic: If it has maxParticipants > 1, check active visits for today
        if (pass.maxParticipants && pass.maxParticipants > 1) {

            // Define time window (Today)
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);

            // Count visits
            const currentCount = await this.visitModel.countDocuments({
                passId: data.passId,
                visitDate: { $gte: startOfDay, $lte: endOfDay },
                status: 'active',
                tenantId
            }).exec();

            if (currentCount >= pass.maxParticipants) {
                throw new BadRequestException(`Group is full! (${currentCount}/${pass.maxParticipants})`);
            }
        }

        // 3. Create Visit Record
        const newVisit = new this.visitModel({
            passId: data.passId,
            visitDate: new Date(),
            status: 'active',
            count: 1,
            guestName: data.guestName,
            guestPhone: data.guestPhone,
            tenantId
        });

        return newVisit.save();
    }

    async findAll(tenantId: string) {
        return this.visitModel.find({ tenantId }).populate('passId').sort({ visitDate: -1 }).exec();
    }
}
