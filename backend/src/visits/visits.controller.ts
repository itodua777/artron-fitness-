
import { Controller, Post, Body, Headers, Get } from '@nestjs/common';
import { VisitsService } from './visits.service';

@Controller('api/visits')
export class VisitsController {
    constructor(private readonly visitsService: VisitsService) { }
    private readonly MOCK_TENANT_ID = '507f1f77bcf86cd799439011';

    @Post('check-in')
    async checkIn(@Body() body: any, @Headers() headers: any) {
        const tenantId = headers['x-tenant-id'] || this.MOCK_TENANT_ID;
        return this.visitsService.checkIn(body, tenantId);
    }

    @Get()
    async findAll(@Headers() headers: any) {
        const tenantId = headers['x-tenant-id'] || this.MOCK_TENANT_ID;
        return this.visitsService.findAll(tenantId);
    }
}
