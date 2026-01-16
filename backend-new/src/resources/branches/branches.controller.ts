import { Controller, Get, Post, Body } from '@nestjs/common';
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';

@Controller('branches')
export class BranchesController {
    constructor(private readonly branchesService: BranchesService) { }

    @Post()
    create(@Body() createBranchDto: CreateBranchDto) {
        return this.branchesService.create(createBranchDto);
    }

    @Get()
    findAll() {
        return this.branchesService.findAll();
    }
}
