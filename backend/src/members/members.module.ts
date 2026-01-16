
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';
import { Member, MemberSchema } from './member.schema';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Member.name, schema: MemberSchema }]),
        CloudinaryModule,
    ],
    controllers: [MembersController],
    providers: [MembersService],
})
export class MembersModule { }
