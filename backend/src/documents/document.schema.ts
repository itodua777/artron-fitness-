
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DocDocument = Doc & Document;

@Schema({ timestamps: true })
export class Doc {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    content: string;

    @Prop({ required: true })
    date: string;

    @Prop({ default: 'ORDER' })
    type: string;

    @Prop()
    tenantId: string;
}

export const DocSchema = SchemaFactory.createForClass(Doc);
