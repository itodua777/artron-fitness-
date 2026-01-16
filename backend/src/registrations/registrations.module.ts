
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RegistrationsController } from './registrations.controller';
import { RegistrationsService } from './registrations.service';
import { CompanyRegistration, CompanyRegistrationSchema } from './registration.schema';
import { TenantsModule } from '../tenants/tenants.module';

@Module({
    imports: [TenantsModule],
    controllers: [RegistrationsController],
    providers: [
        RegistrationsService,
        {
            provide: 'CompanyRegistrationModel', // Assuming usage of @InjectModel(CompanyRegistration.name)
            useValue: function MockRegister(data) { Object.assign(this, data); this.save = () => this; }
        }
    ],
})
export class RegistrationsModule { }
