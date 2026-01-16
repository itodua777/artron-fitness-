
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassesController } from './passes.controller';
import { PassesService } from './passes.service';
import { Pass, PassSchema } from './pass.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: Pass.name, schema: PassSchema }])],
    controllers: [PassesController],
    providers: [PassesService],
    exports: [PassesService], // Export needed for seeding in TenantsModule
})
export class PassesModule { }
