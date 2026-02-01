import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';

@Controller('warehouse')
export class WarehouseController {
    constructor(private readonly warehouseService: WarehouseService) { }

    @Post()
    create(@Body() createDto: any) {
        return this.warehouseService.create(createDto);
    }

    @Get()
    findAll(@Query('category') category: string) {
        return this.warehouseService.findAll(category);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.warehouseService.remove(id);
    }
}
