
import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { CorporateService } from './corporate.service';

@Controller('api/corporate')
export class CorporateController {
    constructor(private readonly corporateService: CorporateService) { }

    @Get()
    async findAll(@Query('category') category: 'PARTNER' | 'CLIENT') {
        return this.corporateService.findAll(category);
    }

    @Post()
    async create(@Body() createCorporateDto: any) {
        return this.corporateService.create(createCorporateDto);
    }
}
