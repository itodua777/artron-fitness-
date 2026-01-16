
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LeadDocument = Lead & Document;

@Schema({ timestamps: true })
export class Lead {
    @Prop({ required: true })
    email: string;

    @Prop()
    source: string;
}

export const LeadSchema = SchemaFactory.createForClass(Lead);
