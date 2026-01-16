
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { Tenant } from './tenant.schema';

@Controller('api/tenants')
export class TenantsController {
    constructor(private readonly tenantsService: TenantsService) { }

    @Get()
    async findAll(): Promise<Tenant[]> {
        return this.tenantsService.findAll();
    }

    @Post()
    async create(@Body() createTenantDto: any) {
        return this.tenantsService.createTenant(createTenantDto);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.tenantsService.findById(id);
    }

    @Post(':id') // Using POST for update to avoid CORS OPTIONS issues sometimes, but ideally PUT/PATCH
    async update(@Param('id') id: string, @Body() updateTenantDto: any) {
        return this.tenantsService.updateTenant(id, updateTenantDto);
    }

    @Post(':id/admin')
    async createAdmin(@Param('id') id: string, @Body() createAdminDto: any) {
        // Pass tenantName if available in DTO for logging purposes, 
        // otherwise service will default to 'Unknown Tenant' 
        // or we could fetch tenant first if we wanted to be strict.
        return this.tenantsService.createTenantAdmin(id, createAdminDto);
    }
}
