import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../database/schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async getUserById(id: string): Promise<User> {
        return this.userModel.findById(id).exec();
    }

    async getUsers(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const newUser = new this.userModel(createUserDto);
        return newUser.save();
    }

    async updateUser(id: string, updateUserDto: Partial<User>): Promise<User> {
        return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
    }
}
