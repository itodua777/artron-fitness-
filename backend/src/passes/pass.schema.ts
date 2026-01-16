
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type PassDocument = Pass & Document;

@Schema({ timestamps: true })
export class Pass {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    price: number;

    @Prop({ required: true })
    duration: number;

    @Prop()
    description: string;

    @Prop()
    features: string;

    @Prop({ default: true })
    active: boolean;

    // --- New Fields for Activities ---
    @Prop({ type: String, enum: ['INDIVIDUAL', 'GROUP', 'CALENDAR', 'MIXED'], default: 'INDIVIDUAL' })
    type: string;

    @Prop({ type: String, enum: ['full', 'custom'], default: 'full' })
    timeMode: string;

    @Prop()
    startTime: string; // e.g., "09:00"

    @Prop()
    endTime: string; // e.g., "22:00"

    @Prop({ default: 1 })
    maxParticipants: number;

    @Prop()
    targetAge: string;

    @Prop()
    targetStatus: string;

    @Prop({ type: [String], default: [] })
    days: string[]; // for recurring schedules e.g., ['Mon', 'Wed']

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Tenant' })
    tenantId: string;
}

export const PassSchema = SchemaFactory.createForClass(Pass);
