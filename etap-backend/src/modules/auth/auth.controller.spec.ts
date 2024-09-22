import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';


describe('AuthService', () => {
    let authService: AuthService;
    let userService: UserService;
    let jwtService: JwtService;

    const mockUserService = {
        findById: jest.fn(),
        findByEmail: jest.fn(),
        createUser: jest.fn(),
        updatePassword: jest.fn(),
    };

    const mockJwtService = {
        signAsync: jest.fn(),
        verify: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: UserService, useValue: mockUserService },
                { provide: JwtService, useValue: mockJwtService },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        userService = module.get<UserService>(UserService);
        jwtService = module.get<JwtService>(JwtService);
    });

    describe('validateUser', () => {
        it('should return user if credentials are valid', async () => {
            const user = { id: 1, email: 'test@example.com', password: await bcrypt.hash('password', 10) };
            jest.spyOn(mockUserService, 'findById').mockResolvedValue(user);

            const result = await authService.validateUser(1, 'password');
            expect(result).toEqual({ id: 1, email: 'test@example.com' });
        });

        it('should return null if user not found', async () => {
            jest.spyOn(mockUserService, 'findById').mockResolvedValue(null);
            const result = await authService.validateUser(1, 'password');
            expect(result).toBeNull();
        });

        it('should throw an error if user service fails', async () => {
            jest.spyOn(mockUserService, 'findById').mockRejectedValue(new Error());
            await expect(authService.validateUser(1, 'password')).rejects.toThrow(HttpException);
        });
    });

    describe('login', () => {
        it('should return user and token if credentials are valid', async () => {
            const user = { id: 1, email: 'test@example.com', password: await bcrypt.hash('password', 10) };
            jest.spyOn(mockUserService, 'findByEmail').mockResolvedValue(user);
            jest.spyOn(jwtService, 'signAsync').mockResolvedValue('token');

            const result = await authService.login('test@example.com', 'password');
            expect(result).toEqual({ user, token: 'token' });
        });

        it('should throw an error if credentials are invalid', async () => {
            jest.spyOn(mockUserService, 'findByEmail').mockResolvedValue(null);
            await expect(authService.login('test@example.com', 'wrongpassword')).rejects.toThrow(HttpException);
        });

        it('should throw an error if user service fails', async () => {
            jest.spyOn(mockUserService, 'findByEmail').mockRejectedValue(new Error());
            await expect(authService.login('test@example.com', 'password')).rejects.toThrow(HttpException);
        });
    });

    describe('create', () => {
        it('should create a user and return the user and token', async () => {
            const userDto = { name: 'John Doe', email: 'john@example.com', password: 'password' };
            const newUser = { id: 1, email: 'john@example.com' };
            jest.spyOn(mockUserService, 'createUser').mockResolvedValue({ dataValues: newUser });
            jest.spyOn(jwtService, 'signAsync').mockResolvedValue('token');

            const result = await authService.create(userDto);
            expect(result).toEqual({ user: newUser, token: 'token' });
        });

        it('should throw an error if user service fails', async () => {
            jest.spyOn(mockUserService, 'createUser').mockRejectedValue(new Error());
            await expect(authService.create({ name: 'John Doe', email: 'john@example.com', password: 'password' })).rejects.toThrow(HttpException);
        });
    });

    describe('requestPasswordReset', () => {
        it('should send a password reset email', async () => {
            const email = 'test@example.com';
            jest.spyOn(mockUserService, 'findByEmail').mockResolvedValue({ id: 1, email });
            jest.spyOn(jwtService, 'sign').mockReturnValue('resetToken');

            const result = await authService.requestPasswordReset(email);
            expect(result).toEqual({ message: 'Password reset link sent to your email' });
        });

        it('should throw an error if user not found', async () => {
            jest.spyOn(mockUserService, 'findByEmail').mockResolvedValue(null);
            await expect(authService.requestPasswordReset('notfound@example.com')).rejects.toThrow(HttpException);
        });

    });
});
