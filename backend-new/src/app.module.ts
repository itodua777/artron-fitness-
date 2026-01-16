import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { IamModule } from './iam/iam.module';
import { RolesModule } from './resources/roles/roles.module';
import { CompaniesModule } from './resources/companies/companies.module';
import { BranchesModule } from './resources/branches/branches.module';
import { DepartmentsModule } from './resources/departments/departments.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    IamModule,
    RolesModule,
    CompaniesModule,
    BranchesModule,
    DepartmentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
