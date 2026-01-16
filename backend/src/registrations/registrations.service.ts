
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CompanyRegistration, CompanyRegistrationDocument } from './registration.schema';
import { TenantsService } from '../tenants/tenants.service';

import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class RegistrationsService {
    constructor(
        @InjectModel(CompanyRegistration.name) private registrationModel: Model<CompanyRegistrationDocument>,
        private tenantsService: TenantsService
    ) { }

    async create(data: any): Promise<CompanyRegistration> {
        // 1. Create Tenant
        const tenantData = {
            name: data.companyName || data.brandName, // Prefer brand name if company name logic varies
            brandName: data.brandName,
            legalAddress: data.legalAddress,
            actualAddress: data.actualAddress || data.legalAddress,
            identCode: data.identCode,
            activityField: data.activityField,
            contactEmail: data.gmEmail, // Use GM email for main contact initially
            companyPhone: data.gmPhone,
            directorName: data.directorName,
            directorId: data.directorId,
            directorPhone: data.directorPhone,
            directorEmail: data.directorEmail,
            gmName: data.gmName,
            gmId: data.gmId,
            gmPhone: data.gmPhone,
            gmEmail: data.gmEmail,
            logo: data.logo
        };

        const newTenant: any = await this.tenantsService.createTenant(tenantData);

        // 2. Create Admin User for this Tenant
        const adminData = {
            email: data.gmEmail,
            firstname: data.gmName.split(' ')[0], // Simple split, improve if separate fields avail
            lastname: data.gmName.split(' ').slice(1).join(' ') || '.',
            phone: data.gmPhone,
            IdCard: data.gmId,
            role: 'Super Admin', // Give full access
            tenantName: newTenant.name
        };

        try {
            await this.tenantsService.createTenantAdmin(newTenant._id.toString(), adminData);
        } catch (e) {
            console.error('Failed to create admin user', e);
            // Optionally rollback tenant creation or just log error
        }

        // 3. Save Registration Record (optional derived tracking)
        // Ignoring original mock DB save for now as we are creating real entities directly

        // 4. Return result
        // TODO: Send real email if configured

        return {
            ...newTenant.toObject(),
            status: 'ACTIVE' // Directly active for now
        } as any;
    }
}
