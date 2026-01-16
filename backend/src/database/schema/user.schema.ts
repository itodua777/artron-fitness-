import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true })
    firstname: string;

    @Prop({ required: true })
    lastname: string;

    @Prop({ required: true, unique: true })
    IdCard: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop()
    mobile: string;

    @Prop()
    birthday: Date;

    @Prop({ required: true })
    password: string;

    @Prop({ default: 'user' })
    role: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Tenant' })
    tenantId: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
