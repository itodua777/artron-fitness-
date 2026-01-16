export class CreateUserDto {
    firstname: string;
    lastname: string;
    IdCard: string;
    email: string;
    mobile?: string;
    birthday?: Date;
    password?: string;
    role?: string;
    tenantId?: string;
}
