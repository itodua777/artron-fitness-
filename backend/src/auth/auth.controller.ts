
import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() body: any) {
        const user = await this.authService.validateUser(body.email, body.password);
        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }
        return this.authService.login(user);
    }

    @Post('change-password')
    async changePassword(@Body() body: any) {
        try {
            await this.authService.changePassword(body.userId, body.oldPassword, body.newPassword);
            return { success: true, message: 'Password updated successfully' };
        } catch (e: any) {
            throw new UnauthorizedException(e.message || 'Failed to update password');
        }
    }
}
