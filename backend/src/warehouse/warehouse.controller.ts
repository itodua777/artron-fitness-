
import { Controller, Get, Post, Put, Delete, Body, Param, Query, Headers } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';

@Controller('api/warehouse')
export class WarehouseController {
    constructor(private readonly service: WarehouseService) { }
    private readonly MOCK_TENANT_ID = '507f1f77bcf86cd799439011';

    @Post()
    async create(@Body() body: any, @Headers() headers: any) {
        const tenantId = headers['x-tenant-id'] || this.MOCK_TENANT_ID;
        return this.service.create(body, tenantId);
    }

    @Get()
    async findAll(@Query('category') category: string, @Headers() headers: any) {
        const tenantId = headers['x-tenant-id'] || this.MOCK_TENANT_ID;
        return this.service.findAll(tenantId, category);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() body: any) {
        return this.service.update(id, body);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.service.delete(id);
    }
}
