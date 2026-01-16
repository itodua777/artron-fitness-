
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CompanyRegistrationDocument = CompanyRegistration & Document;

@Schema({ timestamps: true })
export class CompanyRegistration {
    @Prop({ required: true })
    brandName: string;

    @Prop()
    activityField: string;

    @Prop()
    companyName: string;

    @Prop()
    legalAddress: string;

    @Prop({ required: true })
    identCode: string;

    @Prop()
    directorName: string;

    @Prop()
    directorId: string;

    @Prop()
    gmName: string;

    @Prop({ required: true })
    gmEmail: string;

    @Prop({ default: 'PENDING' })
    status: string; // PENDING, APPROVED, REJECTED
}

export const CompanyRegistrationSchema = SchemaFactory.createForClass(CompanyRegistration);
