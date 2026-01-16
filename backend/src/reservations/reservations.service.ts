import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reservation, ReservationDocument } from './schemas/reservation.schema';

@Injectable()
export class ReservationsService {
    constructor(@InjectModel(Reservation.name) private reservationModel: Model<ReservationDocument>) { }

    async create(createReservationDto: any): Promise<Reservation> {
        const createdReservation = new this.reservationModel(createReservationDto);
        return createdReservation.save();
    }

    async findAll(): Promise<Reservation[]> {
        // Sort by creation date ascending (queue order)
        return this.reservationModel.find().sort({ createdAt: 1 }).exec();
    }

    async markAsNotified(id: string): Promise<Reservation> {
        return this.reservationModel.findByIdAndUpdate(id, { status: 'notified' }, { new: true }).exec();
    }

    async remove(id: string): Promise<Reservation> {
        return this.reservationModel.findByIdAndDelete(id).exec();
    }
}
