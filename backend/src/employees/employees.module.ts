
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { Employee, EmployeeSchema } from './employee.schema';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Employee.name, schema: EmployeeSchema }]),
        CloudinaryModule
    ],
    controllers: [EmployeesController],
    providers: [EmployeesService],
    exports: [EmployeesService]
})
export class EmployeesModule { }
