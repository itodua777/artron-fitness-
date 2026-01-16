import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ReservationDocument = Reservation & Document;

@Schema({ timestamps: true })
export class Reservation {
    @Prop({ required: true })
    firstName: string;

    @Prop({ required: true })
    lastName: string;

    @Prop({ required: true })
    personalId: string;

    @Prop({ required: true })
    mobile: string;

    @Prop()
    email: string;

    @Prop({ required: true })
    activityType: string;

    @Prop({ default: 'pending', enum: ['pending', 'notified', 'converted', 'cancelled'] })
    status: string;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
