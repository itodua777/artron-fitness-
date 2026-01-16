
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type MemberDocument = Member & Document;

@Schema({ timestamps: true })
export class Member {
    @Prop({ required: true })
    name: string;

    @Prop()
    email: string;

    @Prop()
    phone: string;

    @Prop()
    personalId: string;

    @Prop({ default: 'GE' })
    citizenship: string;

    @Prop()
    passportNumber: string;

    @Prop()
    address: string;

    @Prop({ default: 'Active' })
    status: string;

    @Prop()
    joinedDate: string;

    @Prop({ default: false })
    isCorporate: boolean;

    @Prop()
    companyName: string;

    @Prop()
    groupId: string;

    @Prop()
    groupType: string;

    @Prop()
    photo: string;

    // Guardian Information (For Minors < 18)
    @Prop()
    guardianFirstName: string;

    @Prop()
    guardianLastName: string;

    @Prop()
    experience: string;

    @Prop()
    goal: string;

    @Prop()
    guardianPersonalId: string;

    @Prop()
    guardianPhone: string;

    // Media/Docs as URLs or Base64
    @Prop()
    idCard: string;

    // Access Control
    @Prop({ default: false })
    accessMobile: boolean;

    @Prop({ default: false })
    accessBracelet: boolean;

    @Prop({ default: false })
    accessCard: boolean;

    @Prop()
    braceletCode: string;

    @Prop()
    cardCode: string;

    @Prop()
    healthCert: string;

    @Prop()
    birthCert: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Tenant', required: false })
    tenantId: string;
}

export const MemberSchema = SchemaFactory.createForClass(Member);
