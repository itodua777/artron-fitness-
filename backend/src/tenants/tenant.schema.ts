
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TenantDocument = Tenant & Document;

@Schema({ timestamps: true })
export class Tenant {
    @Prop({ required: true })
    name: string;

    @Prop()
    brandName: string;

    @Prop()
    legalAddress: string;

    @Prop()
    actualAddress: string;

    @Prop()
    identCode: string;

    @Prop()
    activityField: string;

    @Prop()
    contactEmail: string;

    @Prop()
    companyPhone: string;

    // Socials
    @Prop()
    facebookLink: string;

    @Prop()
    instagramLink: string;

    @Prop()
    tiktokLink: string;

    @Prop()
    youtubeLink: string;

    @Prop()
    linkedinLink: string;

    // Bank
    @Prop()
    bankName: string;

    @Prop()
    bankIban: string;

    @Prop()
    bankSwift: string;

    @Prop()
    recipientName: string;

    // Director
    @Prop()
    directorName: string;

    @Prop()
    directorId: string;

    @Prop()
    directorPhone: string;

    @Prop()
    directorEmail: string;

    @Prop()
    directorSignature: string; // Base64

    // General Manager
    @Prop()
    gmName: string;

    @Prop()
    gmId: string;

    @Prop()
    gmPhone: string;

    @Prop()
    gmEmail: string;

    @Prop()
    gmSignature: string; // Base64

    @Prop({ default: false })
    gmFullAccess: boolean;

    @Prop({ default: 0 })
    setupStep: number; // 0=Unconfigured, 1...4=Steps, 5=Complete

    @Prop()
    logo: string; // Base64 or URL
}

export const TenantSchema = SchemaFactory.createForClass(Tenant);
