
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tenant, TenantDocument } from './tenant.schema';
import { Pass, PassDocument } from '../passes/pass.schema';
import { User, UserDocument } from '../database/schema/user.schema';
import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class TenantsService implements OnModuleInit {
    constructor(
        @InjectModel(Tenant.name) private tenantModel: Model<TenantDocument>,
        @InjectModel(Pass.name) private passModel: Model<PassDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) { }

    async onModuleInit() {
        await this.ensureSeedData();
    }

    async ensureSeedData() {
        const count = await this.tenantModel.countDocuments();
        if (count === 0) {
            console.log('Seeding initial tenants...');

            // Tenant 1: Pixl Fitness
            const tenant1 = await this.tenantModel.create({
                name: 'Pixl Fitness',
                brandName: 'Pixl Fitness',
                legalAddress: 'Tbilisi, Chavchavadze Ave.',
                actualAddress: 'Tbilisi, Chavchavadze Ave.',
                contactEmail: 'info@pixl.ge',
            });

            if (tenant1) {
                await this.passModel.insertMany([
                    { title: '1 თვიანი შეუზღუდავი', price: 120, duration: 30, description: 'ულიმიტო ვიზიტები 1 თვის განმავლობაში', features: 'ულიმიტო ვიზიტები,უფასო პირსახოცი,საუნა', tenantId: tenant1._id },
                    { title: '3 თვიანი აბონემენტი', price: 300, duration: 90, description: 'სპეციალური ფასი 3 თვზე', features: 'ყველა ზონა,უფასო პარკინგი', tenantId: tenant1._id },
                ]);
            }

            // Tenant 2: Iron Gym
            const tenant2 = await this.tenantModel.create({
                name: 'Iron Gym',
                brandName: 'Iron Gym',
                legalAddress: 'Batumi, Rustaveli St.',
                actualAddress: 'Batumi, Rustaveli St.',
                contactEmail: 'contact@iron.ge',
            });

            if (tenant2) {
                await this.passModel.insertMany([
                    { title: 'Day Pass', price: 20, duration: 1, description: 'Single entry', features: 'Gym access', tenantId: tenant2._id },
                    { title: 'Yearly VIP', price: 800, duration: 365, description: 'Full Access', features: 'All inclusive', tenantId: tenant2._id },
                ]);
            }

            if (tenant1 && tenant2) {
                console.log(`Created tenants: ${tenant1.name} (${tenant1._id}), ${tenant2.name} (${tenant2._id})`);
            }
        }
    }

    async findAll(): Promise<Tenant[]> {
        return this.tenantModel.find().exec();
    }

    async createTenant(data: any): Promise<Tenant> {
        const createdTenant = new this.tenantModel(data);
        return createdTenant.save();
    }

    async findById(id: string): Promise<Tenant> {
        return this.tenantModel.findById(id).exec();
    }

    async updateTenant(id: string, data: any): Promise<Tenant> {
        return this.tenantModel.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    async createTenantAdmin(tenantId: string, adminData: any): Promise<User> {
        // 1. Generate or use provided password
        const plainPassword = adminData.password || Math.random().toString(36).slice(-8);

        // 2. Hash password
        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        // 3. Create User
        const newUser = new this.userModel({
            ...adminData,
            password: hashedPassword,
            role: 'DIRECTOR',
            tenantId: tenantId,
        });

        const savedUser = await newUser.save();

        // 4. Log credentials to file
        this.logCredentials(savedUser, plainPassword, adminData.tenantName || 'Unknown Tenant');

        return savedUser;
    }

    private logCredentials(user: UserDocument, plainPass: string, tenantName: string) {
        const filePath = '/Users/davittodua/Documents/artron/credentials.md';
        const timestamp = new Date().toISOString();
        const content = `
## New Admin Registration
**Date:** ${timestamp}
**Tenant:** ${tenantName}
**Name:** ${user.firstname} ${user.lastname}
**Email:** ${user.email}
**Role:** ${user.role}
**Password:** \`${plainPass}\`
---
`;
        try {
            fs.appendFileSync(filePath, content);
            console.log(`Credentials saved to ${filePath}`);
        } catch (err) {
            console.error('Failed to save credentials to file:', err);
        }
    }
}
