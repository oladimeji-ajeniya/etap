import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/user.model';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    // Validate user by ID and password
    async validateUser(id: number, pass: string) {
        try {
            const user = await this.userService.findById(id);
            if (!user) {
                return null;
            }
    
            const match = await this.comparePassword(pass, user.password);
            if (!match) {
                return null;
            }
    
            const { password, ...result } = user;
            return result;
        } catch (error) {
            throw new HttpException('Error validating user', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    public async login(email: string, password: string) {
        try {
            const user = await this.userService.findByEmail(email);
            if (!user) {
                throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
            }
    
            // Compare passwords and throw error if they don't match
            await this.comparePassword(password, user.password);
    
            // Generate the token
            const token = await this.generateToken(user);
            return { user, token };
        } catch (error) {
            console.error('Login error:', error.message); // Log the error for debugging
            throw new HttpException(error.message || 'Error during login', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Create a new user and return the token
    public async create(user) {
        try {
            const pass = await this.hashPassword(user.password);
            const newUser = await this.userService.createUser( user.name, user.email, pass );

            const { password, ...result } = newUser['dataValues'];
            const token = await this.generateToken(result);

            return { user: result, token };
        } catch (error) {
            throw new HttpException(error.response || 'Error creating user', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Generate JWT token
    private async generateToken(user) {
        try {
            const token = await this.jwtService.signAsync({ id: user.id, email: user.email, role: user.role });
            return token;
        } catch (error) {
            throw new HttpException('Error generating token', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Hash password using bcrypt
    private async hashPassword(password: string) {
        try {
            const hash = await bcrypt.hash(password, 10);
            return hash;
        } catch (error) {
            throw new HttpException('Error hashing password', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Compare entered password with the stored hash
    private async comparePassword(enteredPassword: string, dbPassword: string): Promise<boolean> {
        try {
            console.log('Entered Password:', enteredPassword);
            console.log('Stored Hashed Password:', dbPassword);
    
            const match = await bcrypt.compare(enteredPassword, dbPassword);
            if (!match) {
                console.log('Passwords do not match');
                throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
            }
            console.log('Passwords match');
            return match;
        } catch (error) {
            console.error('Error comparing passwords:', error.message);
            throw new HttpException('Error comparing passwords', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // Update user password
    async updatePassword(id: number, currentPassword: string, newPassword: string): Promise<User> {
        try {
            const user = await this.userService.findById(id);
            if (!user) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }

            const isMatch = await this.comparePassword(currentPassword, user.password);
            if (!isMatch) {
                throw new HttpException('Current password is incorrect', HttpStatus.UNAUTHORIZED);
            }

            const hashedPassword = await this.hashPassword(newPassword);
            await this.userService.updatePassword(id, hashedPassword);

            return await this.userService.findById(id);
        } catch (error) {
            throw new HttpException('Error updating password', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Generate password reset token
    async generatePasswordResetToken(email: string): Promise<string> {
        try {
            const user = await this.userService.findByEmail(email);
            if (!user) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }

            const resetToken = this.jwtService.sign({ id: user.id, email: user.email }, { expiresIn: '15m' });
            console.log(`Password reset token for ${email}: ${resetToken}`);
            return resetToken;
        } catch (error) {
            throw new HttpException('Error generating password reset token', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Reset user password using the reset token
    async resetPassword(token: string, newPassword: string): Promise<User> {
        try {
            const payload = this.jwtService.verify(token);
            const user = await this.userService.findById(payload.id);
            if (!user) {
                throw new HttpException('Invalid token or user not found', HttpStatus.UNAUTHORIZED);
            }

            const hashedPassword = await this.hashPassword(newPassword);
            await this.userService.updatePassword(user.id, hashedPassword);

            return await this.userService.findById(user.id);
        } catch (error) {
            throw new HttpException('Error resetting password', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Request a password reset and send email with the token
    async requestPasswordReset(email: string): Promise<{ message: string }> {
        try {
            const resetToken = await this.generatePasswordResetToken(email);

            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: parseInt(process.env.SMTP_PORT),
                secure: false,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASSWORD,
                },
            });

            const mailOptions = {
                from: process.env.SMTP_FROM,
                to: email,
                subject: 'Password Reset Request',
                text: `You requested a password reset. Please use the following token to reset your password: ${resetToken}`,
                html: `<p>You requested a password reset. Please use the following token to reset your password:</p><p><strong>${resetToken}</strong></p>`,
            };

            await transporter.sendMail(mailOptions);

            return { message: 'Password reset link sent to your email' };
        } catch (error) {
            console.error('Error sending password reset email:', error);
            throw new HttpException('Error sending password reset email', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
