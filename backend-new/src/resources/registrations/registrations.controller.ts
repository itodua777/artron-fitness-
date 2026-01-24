import { Controller, Post, Body } from '@nestjs/common';
import { RegistrationsService } from './registrations.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';

@Controller('registrations')
export class RegistrationsController {
    constructor(private readonly registrationsService: RegistrationsService) { }

    @Post()
    create(@Body() createRegistrationDto: CreateRegistrationDto) {
        return this.registrationsService.create(createRegistrationDto);
    }
}
