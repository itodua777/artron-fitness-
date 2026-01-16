import { IsNotEmpty, IsString, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePermissionDto } from '../../roles/dto/create-role.dto';

export class RegisterCompanyDto {
    @IsString()
    @IsNotEmpty()
    companyName: string;

    @IsString()
    @IsNotEmpty()
    branchName: string;

    @IsString()
    @IsNotEmpty()
    departmentName: string;

    @IsString()
    @IsNotEmpty()
    roleName: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreatePermissionDto)
    permissions: CreatePermissionDto[];

    // User Fields
    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsString()
    @IsNotEmpty()
    phone: string;
}
