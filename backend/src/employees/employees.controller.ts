
import { Controller, Get, Post, Body, Headers, UploadedFiles, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { EmployeesService } from './employees.service';

@Controller('api/employees')
export class EmployeesController {
    constructor(private readonly employeesService: EmployeesService) { }

    private readonly MOCK_TENANT_ID = '507f1f77bcf86cd799439011';

    @Post()
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'idCardFile', maxCount: 1 },
        { name: 'criminalRecordFile', maxCount: 1 },
        { name: 'healthCertFile', maxCount: 1 },
        { name: 'certificateFile', maxCount: 1 },
        { name: 'contractFile', maxCount: 1 },
    ]))
    async create(@Body() createEmployeeDto: any, @UploadedFiles() files: {
        idCardFile?: Express.Multer.File[],
        criminalRecordFile?: Express.Multer.File[],
        healthCertFile?: Express.Multer.File[],
        certificateFile?: Express.Multer.File[],
        contractFile?: Express.Multer.File[]
    }, @Headers() headers: any) {
        console.log('Received create employee request');
        console.log('Body:', createEmployeeDto);
        console.log('Files:', files ? Object.keys(files) : 'No files');
        const tenantId = headers['x-tenant-id'] || this.MOCK_TENANT_ID;
        try {
            const result = await this.employeesService.create(createEmployeeDto, files, tenantId);
            console.log('Employee created successfully:', (result as any)._id);
            return result;
        } catch (error) {
            console.error('Error creating employee:', error);
            throw error;
        }
    }

    @Get()
    async findAll(@Headers() headers: any) {
        const tenantId = headers['x-tenant-id'] || this.MOCK_TENANT_ID;
        return this.employeesService.findAll(tenantId);
    }
}
