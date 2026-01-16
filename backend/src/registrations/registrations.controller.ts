
import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { RegistrationsService } from './registrations.service';

@Controller('api/registrations')
export class RegistrationsController {
    constructor(private readonly registrationsService: RegistrationsService) { }

    @Post()
    async create(@Body() body: any) {
        if (!body.brandName || !body.identCode || !body.gmEmail) {
            throw new BadRequestException('Required fields missing');
        }

        // Convert generic body to our schema if needed, but Mongoose handles extra fields gracefully mostly.
        // Ideally we would use DTOs here.
        const result = await this.registrationsService.create(body);
        return { success: true, data: result };
    }
}
