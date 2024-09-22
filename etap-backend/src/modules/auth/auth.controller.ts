import { Controller, Body, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from '../user/dtos/login.dto';
import { RequestResetPasswordDto } from '../user/dtos/request-reset-password.dto';
import { ResetPasswordDto } from '../user/dtos/reset-password.dto';
import { UpdatePasswordDto } from '../user/dtos/update-password.dto';
import { CreateUserDto } from '../user/dtos/create-user.dto';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @ApiOperation({ summary: 'Login a user' })
    @ApiResponse({ status: 200, description: 'User login successful.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 500, description: 'Invalid credentials.' })
    @UsePipes(new ValidationPipe({ transform: true }))
    async login(@Body() loginDto: LoginDto) {
        return await this.authService.login(loginDto.email, loginDto.password);
    }


    @Post('signup')
    @ApiOperation({ summary: 'Sign up a new user' })
    @ApiResponse({ status: 201, description: 'User created successfully.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    @UsePipes(new ValidationPipe({ transform: true }))
    async signUp(@Body() createUserDto: CreateUserDto) {
        return await this.authService.create(createUserDto);
    }

    @Post('request-reset-password')
    @ApiOperation({ summary: 'Request a password reset link' })
    @ApiResponse({ status: 200, description: 'Password reset link sent.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    @UsePipes(new ValidationPipe({ transform: true }))
    async requestResetPassword(@Body() requestResetPasswordDto: RequestResetPasswordDto) {
        return this.authService.requestPasswordReset(requestResetPasswordDto.email);
    }

    @Post('reset-password')
    @ApiOperation({ summary: 'Reset password using a token' })
    @ApiResponse({ status: 200, description: 'Password reset successful.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    @UsePipes(new ValidationPipe({ transform: true }))
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return this.authService.resetPassword(resetPasswordDto.token, resetPasswordDto.newPassword);
    }

    @Post('update-password')
    @ApiOperation({ summary: 'Update password' })
    @ApiResponse({ status: 200, description: 'Password updated successfully.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    @UsePipes(new ValidationPipe({ transform: true }))
    async updatePassword(@Body() updatePasswordDto: UpdatePasswordDto) {
        return this.authService.updatePassword(
            updatePasswordDto.id,
            updatePasswordDto.currentPassword,
            updatePasswordDto.newPassword,
        );
    }
}

