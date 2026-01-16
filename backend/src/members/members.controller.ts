
import { Controller, Get, Post, Patch, Body, Param, Req, Headers, BadRequestException } from '@nestjs/common';
import { MembersService } from './members.service';

@Controller('api/members')
export class MembersController {
    constructor(private readonly membersService: MembersService) { }

    // Helper to extract Tenant ID
    // In a real app, use a Guard/Interceptor to attach user/tenant to Request
    // Use a static valid ObjectId for mock/dev usage to satisfy Mongoose Schema validation
    private readonly MOCK_TENANT_ID = '507f1f77bcf86cd799439011';

    private getTenantId(req: any, headers: any): string {
        // 1. Try get from Authenticated User (if passed via Guard)
        if (req.user && req.user.tenantId) return req.user.tenantId;

        // 2. Try get from Headers (for public/demo endpoints or before Auth implemented fully)
        if (headers['x-tenant-id']) return headers['x-tenant-id'];

        // 3. Fallback or Error
        // For now, we return a mock ID or error. Ideally, we throw error.
        // However, to keep it simple for migration without full auth everywhere:
        // return "default-tenant-id"; 

        // BETTER: Throw error to enforce tenant context
        throw new BadRequestException('Tenant Context Missing');
    }

    @Get()
    async findAll(@Req() req: any, @Headers() headers: any) {
        // Retrieve Tenant ID manually for now. 
        // Allow optional tenant ID for mock mode
        const tenantId = headers['x-tenant-id'] || this.MOCK_TENANT_ID;
        return this.membersService.findAll(tenantId);
    }

    @Post()
    async create(@Body() createMemberDto: any, @Headers() headers: any) {
        const tenantId = headers['x-tenant-id'] || this.MOCK_TENANT_ID;
        return this.membersService.create(createMemberDto, tenantId);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateDto: any) {
        return this.membersService.update(id, updateDto);
    }

    @Post(':id/invite')
    async sendInvite(@Param('id') id: string) {
        return this.membersService.sendInvite(id);
    }

    @Post(':id/otp')
    async sendOtp(@Param('id') id: string) {
        return this.membersService.sendOtp(id);
    }

    @Post('batch')
    async createBatch(@Body() body: any, @Headers() headers: any) {
        const tenantId = headers['x-tenant-id'] || this.MOCK_TENANT_ID;

        const { members, groupType } = body;
        if (!members || !Array.isArray(members)) {
            throw new BadRequestException('Members array required');
        }

        return this.membersService.createBatch(members, groupType, tenantId);
    }
}
