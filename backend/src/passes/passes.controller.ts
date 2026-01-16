
import { Controller, Get, Post, Put, Body, Headers, Param, BadRequestException } from '@nestjs/common';
import { PassesService } from './passes.service';

@Controller('api/passes')
export class PassesController {
    constructor(private readonly passesService: PassesService) { }

    private readonly MOCK_TENANT_ID = '507f1f77bcf86cd799439011';

    @Get()
    async findAll(@Headers() headers: any) {
        const tenantId = headers['x-tenant-id'] || this.MOCK_TENANT_ID;
        return this.passesService.findAll(tenantId);
    }

    @Post()
    async create(@Body() body: any, @Headers() headers: any) {
        console.log('Creating Pass with body:', body);
        try {
            const tenantId = headers['x-tenant-id'] || this.MOCK_TENANT_ID;
            const result = await this.passesService.create(body, tenantId);
            console.log('Pass created:', result);
            return result;
        } catch (error) {
            console.error('Error creating pass:', error);
            throw error;
        }
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() body: any) {
        console.log(`Updating Pass ${id} with body:`, body);
        return this.passesService.update(id, body);
    }
}
