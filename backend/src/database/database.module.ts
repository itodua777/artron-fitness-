import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { UserRepository } from './repository/user.repository';

@Module({
    imports: [
        // MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ],
    providers: [
        UserRepository,
        {
            provide: 'UserModel', // Need to confirm token name
            useValue: { findOne: () => ({ exec: () => null }) }
        }
    ],
    exports: [UserRepository],
})
export class DatabaseModule { }
