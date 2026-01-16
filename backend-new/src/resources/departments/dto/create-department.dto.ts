import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateDepartmentDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsUUID()
    @IsNotEmpty()
    branchId: string;
}
