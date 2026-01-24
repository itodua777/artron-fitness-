import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PassesService } from './passes.service';
import { CreatePassDto } from './dto/create-pass.dto';

@Controller('passes')
export class PassesController {
    constructor(private readonly passesService: PassesService) { }

    @Post()
    create(@Body() createPassDto: CreatePassDto) {
        return this.passesService.create(createPassDto);
    }

    @Get()
    findAll(@Query('branchId') branchId?: string) {
        return this.passesService.findAll(branchId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.passesService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updatePassDto: Partial<CreatePassDto>) {
        return this.passesService.update(id, updatePassDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.passesService.remove(id);
    }
}
