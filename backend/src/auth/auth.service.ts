
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../database/schema/user.schema';
import { Tenant, TenantDocument } from '../tenants/tenant.schema';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
    private readonly JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Tenant.name) private tenantModel: Model<TenantDocument>
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        // MOCK: Bypass DB for test users
        if (pass === '123456') { // Mock OTP as password
            if (email === 'david@olympia.com') {
                return {
                    _id: 'mock-user-1',
                    email: 'david@olympia.com',
                    firstname: 'David',
                    lastname: 'Director',
                    role: 'Director',
                    tenantId: 'mock-tenant-1'
                };
            }
            if (email === 'giorgi@sparta.com') {
                return {
                    _id: 'mock-user-2',
                    email: 'giorgi@sparta.com',
                    firstname: 'Giorgi',
                    lastname: 'Manager',
                    role: 'General Manager',
                    tenantId: 'mock-tenant-2'
                };
            }
        }

        // Attempt DB lookup (which will fail if DB is down)
        try {
            const user = await this.userModel.findOne({ email });
            if (user && (await bcrypt.compare(pass, user.password))) {
                const { password, ...result } = user.toObject();
                return result;
            }
        } catch (e) {
            console.error('Auth validation error:', e);
        }

        return null;
    }

    async login(user: any) {
        // Fetch Tenant details for setup flow
        let setupStep = 0;
        let activeModules = {};

        if (user.tenantId && !String(user.tenantId).startsWith('mock')) {
            try {
                const tenant = await this.tenantModel.findById(user.tenantId);
                if (tenant) {
                    setupStep = tenant.setupStep || 0;
                    // In a real app, we might store active modules in DB too, 
                    // or derive it. For now, we trust the frontend/mock or pass defaults.
                }
            } catch (e) {
                console.error("Error fetching tenant details", e);
            }
        } else {
            // Mock tenants are assumed setup
            setupStep = 5;
        }

        const payload = { userId: user._id, email: user.email, tenantId: user.tenantId, role: user.role };
        // Handle case where user might still have 'name' property or uses firstname/lastname
        const fullName = user.name || (user.firstname && user.lastname ? `${user.firstname} ${user.lastname}` : user.email);

        return {
            token: jwt.sign(payload, this.JWT_SECRET, { expiresIn: '24h' }),
            user: {
                id: user._id,
                name: fullName,
                email: user.email,
                tenantId: user.tenantId,
                role: user.role,
                setupStep: setupStep
            },
        };
    }

    async createUser(userData: any) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const newUser = new this.userModel({ ...userData, password: hashedPassword });
        return newUser.save();
    }

    async changePassword(userId: string, currentPass: string, newPass: string): Promise<boolean> {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Logic for mock users could be added here if needed, but assuming DB users for now
        // If user is from mock data (hardcoded), we can't really change it permanently without DB

        const isMatch = await bcrypt.compare(currentPass, user.password);
        if (!isMatch) {
            throw new Error('Incorrect old password');
        }

        const hashedNewPass = await bcrypt.hash(newPass, 10);
        user.password = hashedNewPass;
        await user.save();
        return true;
    }
}
