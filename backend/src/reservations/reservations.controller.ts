import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { ReservationsService } from './reservations.service';

@Controller('api/reservations')
export class ReservationsController {
    constructor(private readonly reservationsService: ReservationsService) { }

    @Post()
    create(@Body() createReservationDto: any) {
        return this.reservationsService.create(createReservationDto);
    }

    @Get()
    findAll() {
        return this.reservationsService.findAll();
    }

    @Patch(':id/notify')
    notify(@Param('id') id: string) {
        return this.reservationsService.markAsNotified(id);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.reservationsService.remove(id);
    }
}
