
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WarehouseController } from './warehouse.controller';
import { WarehouseService } from './warehouse.service';
import { WarehouseItem, WarehouseItemSchema } from './warehouse-item.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: WarehouseItem.name, schema: WarehouseItemSchema }])
    ],
    controllers: [WarehouseController],
    providers: [WarehouseService],
})
export class WarehouseModule { }
