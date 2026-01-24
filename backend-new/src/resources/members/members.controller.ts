import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';

@Controller('members')
export class MembersController {
    constructor(private readonly membersService: MembersService) { }

    @Post()
    create(@Body() createMemberDto: CreateMemberDto) {
        return this.membersService.create(createMemberDto);
    }

    @Get()
    findAll(@Query('branchId') branchId?: string) {
        return this.membersService.findAll(branchId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.membersService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateMemberDto: Partial<CreateMemberDto>) {
        return this.membersService.update(id, updateMemberDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.membersService.remove(id);
    }
}
