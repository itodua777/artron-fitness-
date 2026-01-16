import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
// Will add Guards later, for now keeping it open or commenting usage
// import { PoliciesGuard } from '../../iam/guards/policies.guard';
// import { CheckPolicies } from '../../iam/decorators/check-policies.decorator';

@Controller('roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) { }

    @Post()
    create(@Body() createRoleDto: CreateRoleDto) {
        return this.rolesService.create(createRoleDto);
    }

    @Get()
    findAll() {
        return this.rolesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.rolesService.findOne(id);
    }
}
