import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '../database/schema/user.schema';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get(':id')
    async getUser(@Param('id') id: string): Promise<User> {
        return this.userService.getUserById(id);
    }

    @Get()
    async getUsers(): Promise<User[]> {
        return this.userService.getUsers();
    }

    @Post()
    async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.userService.createUser(createUserDto);
    }

    @Patch(':id')
    async updateUser(@Param('id') id: string, @Body() updateUserDto: Partial<User>): Promise<User> {
        return this.userService.updateUser(id, updateUserDto);
    }
}
