import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { TenantsService } from './tenants.service';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Optional: protect if needed, but frontend might call before full auth in some flows?

@Controller('tenants')
export class TenantsController {
    constructor(private readonly tenantsService: TenantsService) { }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.tenantsService.findOne(id);
    }
}
