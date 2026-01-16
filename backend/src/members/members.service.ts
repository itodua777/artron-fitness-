
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Member, MemberDocument } from './member.schema';

import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class MembersService {
    constructor(
        @InjectModel(Member.name) private memberModel: Model<MemberDocument>,
        private cloudinaryService: CloudinaryService
    ) { }

    async create(createMemberDto: any, tenantId: string): Promise<Member> {
        if (this.cloudinaryService.isBase64(createMemberDto.photo)) {
            try {
                createMemberDto.photo = await this.cloudinaryService.uploadImage(createMemberDto.photo);
            } catch (e) {
                console.error('Image upload failed, falling back to base64 (or empty)', e);
                // Optional: fail or keep base64? Keeping base64 might fill DB.
                // Better to clear it or throw error?
                // Let's keep it but log error for now, or maybe just proceed.
            }
        }
        const createdMember = new this.memberModel({ ...createMemberDto, tenantId });
        return createdMember.save();
    }

    async findAll(tenantId: string): Promise<Member[]> {
        return this.memberModel.find().sort({ createdAt: -1 }).exec();
    }

    async createBatch(members: any[], groupType: string, tenantId: string): Promise<Member[]> {
        const groupId = members.length > 1 ? Math.random().toString(36).substring(7) : null;

        const membersToCreate = await Promise.all(members.map(async (member) => {
            if (this.cloudinaryService.isBase64(member.photo)) {
                try {
                    member.photo = await this.cloudinaryService.uploadImage(member.photo);
                } catch (e) {
                    console.error('Batch Image upload failed', e);
                }
            }
            return {
                ...member,
                tenantId: tenantId || 'mock-tenant-id', // Ideally from request user
                groupId,
                groupType: groupId ? groupType : null,
                status: 'Active'
            };
        }));

        return this.memberModel.insertMany(membersToCreate) as unknown as Promise<Member[]>;
    }

    async update(id: string, updateDto: any): Promise<Member> {
        return this.memberModel.findByIdAndUpdate(id, updateDto, { new: true }).exec();
    }

    async sendInvite(id: string) {
        const member = await this.memberModel.findById(id);
        if (!member) throw new Error('Member not found');

        const magicLink = `https://artron.app/auth/login?token=magic_${Math.random().toString(36).substring(7)}`;
        console.log(`[EMAIL SIMULATION] Sending Invite to ${member.email}`);
        console.log(`[EMAIL SIMULATION] Link: ${magicLink}`);

        return { success: true, message: 'Invite sent', link: magicLink };
    }

    async sendOtp(id: string) {
        const member = await this.memberModel.findById(id);
        if (!member) throw new Error('Member not found');

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`[EMAIL SIMULATION] Sending OTP to ${member.email}`);
        console.log(`[EMAIL SIMULATION] OTP: ${otp}`);

        return { success: true, message: 'OTP sent', otp };
    }
}

