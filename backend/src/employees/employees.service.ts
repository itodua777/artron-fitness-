
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Employee, EmployeeDocument } from './employee.schema';

import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class EmployeesService {
    constructor(
        @InjectModel(Employee.name) private employeeModel: Model<EmployeeDocument>,
        private cloudinaryService: CloudinaryService
    ) { }

    async create(createEmployeeDto: any, files: any, tenantId: string): Promise<Employee> {
        // Extract and upload files
        const filePaths: any = {};
        if (files) {
            // Helper to upload if exists
            const uploadIfNeeded = async (fileKey: string, dbField: string) => {
                if (files[fileKey]?.[0]) {
                    try {
                        // Check if buffer exists (memory storage) or path (disk storage fallback)
                        const file = files[fileKey][0];
                        filePaths[dbField] = await this.cloudinaryService.uploadImage(file);
                    } catch (e) {
                        console.error(`Failed to upload ${fileKey}`, e);
                    }
                }
            };

            await uploadIfNeeded('idCardFile', 'idCardUrl');
            await uploadIfNeeded('criminalRecordFile', 'criminalRecordUrl');
            await uploadIfNeeded('healthCertFile', 'healthCertUrl');
            await uploadIfNeeded('certificateFile', 'certificateUrl');
            await uploadIfNeeded('contractFile', 'contractUrl');
        }

        const newEmployee = new this.employeeModel({
            ...createEmployeeDto,
            ...filePaths,
            tenantId,
        });
        return newEmployee.save();
    }

    async findAll(tenantId: string): Promise<Employee[]> {
        return this.employeeModel.find({ tenantId }).exec();
    }

    async findOne(id: string): Promise<Employee> {
        return this.employeeModel.findById(id).exec();
    }
}
