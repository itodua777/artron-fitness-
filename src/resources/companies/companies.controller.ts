import { Controller, Get, Post, Body } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';

import { RegisterCompanyDto } from './dto/register-company.dto';

@Controller('companies')
export class CompaniesController {
    constructor(private readonly companiesService: CompaniesService) { }

    @Post('register')
    register(@Body() registerCompanyDto: RegisterCompanyDto) {
        return this.companiesService.register(registerCompanyDto);
    }

    @Post()
    create(@Body() createCompanyDto: CreateCompanyDto) {
        return this.companiesService.create(createCompanyDto);
    }

    @Get()
    findAll() {
        return this.companiesService.findAll();
    }
}
