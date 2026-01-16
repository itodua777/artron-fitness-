
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TenantsModule } from './tenants/tenants.module';
import { AuthModule } from './auth/auth.module';
import { MembersModule } from './members/members.module';
import { PassesModule } from './passes/passes.module';
import { VisitsModule } from './visits/visits.module';
import { LeadsModule } from './leads/leads.module';
import { RegistrationsModule } from './registrations/registrations.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { CorporateModule } from './corporate/corporate.module';

import { EmployeesModule } from './employees/employees.module';

import { WarehouseModule } from './warehouse/warehouse.module';
import { ReservationsModule } from './reservations/reservations.module';
import { DocumentsModule } from './documents/documents.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }), // Load .env globally
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>('MONGO_URI'),
                tls: true,
                tlsAllowInvalidCertificates: true,
            }),
            inject: [ConfigService],
        }),
        AuthModule,
        UserModule,
        EmployeesModule, // Data Management
        TenantsModule,
        CorporateModule,   // Corporate Clients
        LeadsModule,       // CRM / Leads
        RegistrationsModule, // Online Registration
        MembersModule,       // Member Management
        PassesModule,        // Passes & Subscriptions
        VisitsModule,        // Activity Attendance & Capacity
        VisitsModule,        // Activity Attendance & Capacity
        WarehouseModule,     // Product & Inventory
        ReservationsModule,   // Waiting List & Reservations
        DocumentsModule      // Official Documents & Orders
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }
