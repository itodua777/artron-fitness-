
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VisitsController } from './visits.controller';
import { VisitsService } from './visits.service';
import { Visit, VisitSchema } from './visit.schema';
import { Pass, PassSchema } from '../passes/pass.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Visit.name, schema: VisitSchema },
            { name: Pass.name, schema: PassSchema }
        ])
    ],
    controllers: [VisitsController],
    providers: [VisitsService],
})
export class VisitsModule { }
