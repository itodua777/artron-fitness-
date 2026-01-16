
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type WarehouseItemDocument = WarehouseItem & Document;

@Schema({ timestamps: true })
export class WarehouseItem {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    category: string; // 'GROCERY' | 'MATERIAL' | 'ACCESSORY' | 'FIXED_ASSET'

    @Prop({ default: 0 })
    quantity: number;

    @Prop({ default: 'pc' })
    unit: string; // kg, pc, l

    @Prop()
    minStockLevel: number;

    @Prop()
    supplier: string;

    @Prop()
    price: number;

    // Supplier specific fields
    @Prop()
    contactPerson: string;

    @Prop()
    phone: string;

    @Prop({ default: 'Active' })
    status: string;

    // Material specific fields
    @Prop()
    condition: string;

    @Prop()
    note: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Tenant' })
    tenantId: string;
}

export const WarehouseItemSchema = SchemaFactory.createForClass(WarehouseItem);
