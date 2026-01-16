
import { Controller, Get, Post, Body, Headers } from '@nestjs/common';
import { DocumentsService } from './documents.service';

@Controller('api/documents')
export class DocumentsController {
    constructor(private readonly documentsService: DocumentsService) { }

    private readonly MOCK_TENANT_ID = '507f1f77bcf86cd799439011';

    @Post()
    async create(@Body() createDocDto: any, @Headers() headers: any) {
        const tenantId = headers['x-tenant-id'] || this.MOCK_TENANT_ID;
        return this.documentsService.create(createDocDto, tenantId);
    }

    @Get()
    async findAll(@Headers() headers: any) {
        const tenantId = headers['x-tenant-id'] || this.MOCK_TENANT_ID;
        return this.documentsService.findAll(tenantId);
    }
}
