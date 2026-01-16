
import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { LeadsService } from './leads.service';

@Controller('api/leads')
export class LeadsController {
    constructor(private readonly leadsService: LeadsService) { }

    @Post()
    async create(@Body() body: any) {
        if (!body.email) {
            throw new BadRequestException('Email is required');
        }
        return this.leadsService.create(body.email, body.source);
    }
}
