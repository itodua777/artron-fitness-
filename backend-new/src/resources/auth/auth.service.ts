import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.prisma.user.findUnique({
            where: { email },
            include: { branch: true } // Include branch to get companyId if needed, or just for context
        });

        if (!user) {
            return null;
        }

        // Check password
        // SUPPORT BOTH PLAIN TEXT (for initial setup) AND BCRYPT
        const isMatch = (pass === user.password) || (await bcrypt.compare(pass, user.password));

        if (isMatch) {
            // Return user without password
            const { password, ...result } = user;
            return result;
        }

        return null;
    }

    async login(user: any) {
        // Fetch full user with branch and company to get tenantId
        const fullUser = await this.prisma.user.findUnique({
            where: { id: user.id },
            include: { branch: true }
        });

        const tenantId = fullUser?.branch?.companyId;

        const payload = {
            email: user.email,
            sub: user.id,
            branchId: user.branchId,
            tenantId: tenantId
        };

        return {
            token: this.jwtService.sign(payload),
            user: {
                ...user,
                tenantId: tenantId
            },
        };
    }

    async changePassword(userId: string, oldPass: string, newPass: string): Promise<boolean> {
        console.log(`[DEBUG] Attempting password change for userId: ${userId}`);
        const user = await this.prisma.user.findUnique({ where: { id: userId } });

        if (!user) {
            console.log('[DEBUG] Password change failed: User not found in DB');
            return false;
        }

        console.log('[DEBUG] User found. Verifying old password...');
        // Check if old password matches (supports simple & bcrypt)
        const isMatch = (oldPass === user.password) || (await bcrypt.compare(oldPass, user.password));

        if (!isMatch) {
            console.log('[DEBUG] Password change failed: Old password mismatch');
            // console.log(`[DEBUG] Provided: ${oldPass}, Stored: ${user.password}`); // OPTIONAL: Be careful logging this
            return false;
        }

        console.log('[DEBUG] Old password verified. Hashing new password...');
        // Hash new password
        const hashedPassword = await bcrypt.hash(newPass, 10);

        await this.prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
        });

        console.log('[DEBUG] Password updated successfully in DB');
        return true;
    }
}
