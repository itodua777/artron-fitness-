
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CorporateDocument = Corporate & Document;

@Schema({ timestamps: true })
export class Corporate {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, enum: ['PARTNER', 'CLIENT'] })
    category: 'PARTNER' | 'CLIENT';

    @Prop()
    type: string; // e.g. "Insurance", "Retail" or "Custom"

    @Prop()
    contactPerson: string;

    @Prop()
    contactEmail: string;

    @Prop()
    phone: string;

    @Prop({ default: 'Active' })
    status: string;

    @Prop()
    logoText: string;

    // Partner Specific
    @Prop()
    benefits: string;

    // Client Specific
    @Prop()
    identCode: string;

    @Prop()
    discountPercentage: number;

    @Prop({ default: 0 })
    activeEmployees: number;

    @Prop()
    employeeFile: string;
}

export const CorporateSchema = SchemaFactory.createForClass(Corporate);
