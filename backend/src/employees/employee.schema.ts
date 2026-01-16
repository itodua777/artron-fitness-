
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EmployeeDocument = Employee & Document;

@Schema({ timestamps: true })
export class Employee {
    @Prop({ required: true })
    firstName: string;

    @Prop({ required: true })
    lastName: string;

    @Prop({ required: true })
    personalId: string;

    @Prop()
    phone: string;

    @Prop()
    email: string;

    @Prop()
    department: string;

    @Prop()
    position: string;

    @Prop()
    salary: string;

    @Prop()
    joinDate: string;

    @Prop({ default: 'GE' })
    citizenship: string;

    @Prop()
    address: string;

    @Prop()
    zipCode: string;

    @Prop()
    passportNumber: string;

    // File URLs/Paths
    @Prop()
    idCardUrl: string;

    @Prop()
    criminalRecordUrl: string;

    @Prop()
    healthCertUrl: string;

    @Prop()
    certificateUrl: string;

    @Prop()
    contractUrl: string;

    @Prop()
    tenantId: string;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
