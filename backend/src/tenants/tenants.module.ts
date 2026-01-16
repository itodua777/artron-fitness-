
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TenantsController } from './tenants.controller';
import { TenantsService } from './tenants.service';
import { Tenant, TenantSchema } from './tenant.schema';
import { Pass, PassSchema } from '../passes/pass.schema';
import { User, UserSchema } from '../database/schema/user.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Tenant.name, schema: TenantSchema },
            { name: Pass.name, schema: PassSchema },
            { name: User.name, schema: UserSchema },
        ]),
    ],
    controllers: [TenantsController],
    providers: [TenantsService],
    exports: [TenantsService],
})
export class TenantsModule { }
