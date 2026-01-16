
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type VisitDocument = Visit & Document;

@Schema({ timestamps: true })
export class Visit {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Pass', required: true })
    passId: string;

    @Prop({ required: true })
    visitDate: Date;

    @Prop({ default: 'active' }) // active, completed, cancelled
    status: string;

    @Prop({ default: 1 })
    count: number;

    // For Guest check-ins
    @Prop()
    guestName: string;

    @Prop()
    guestPhone: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Tenant' })
    tenantId: string;
}

export const VisitSchema = SchemaFactory.createForClass(Visit);
