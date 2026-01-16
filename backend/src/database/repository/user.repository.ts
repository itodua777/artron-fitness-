import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schema/user.schema';

@Injectable()
export class UserRepository {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async findOne(userFilterQuery: any): Promise<UserDocument> {
        return this.userModel.findOne(userFilterQuery);
    }

    async find(usersFilterQuery: any): Promise<UserDocument[]> {
        return this.userModel.find(usersFilterQuery);
    }

    async create(user: User): Promise<UserDocument> {
        const newUser = new this.userModel(user);
        return newUser.save();
    }

    async findOneAndUpdate(userFilterQuery: any, user: Partial<User>): Promise<UserDocument> {
        return this.userModel.findOneAndUpdate(userFilterQuery, user, { new: true });
    }
}
