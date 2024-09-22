import { Injectable, NotFoundException, InternalServerErrorException, Inject, Logger, ConflictException } from '@nestjs/common';
import { User } from './user.model';
import { USER_REPOSITORY } from 'src/core/constants';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name); 

  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
  ) {}

  // Create a new user with hashed password
  async createUser(name: string, email: string, password: string): Promise<User> {
    try {
      // Check if email already exists
      const existingUser = await this.userRepository.findOne({ where: { email } });
      
      if (existingUser) {
        this.logger.warn(`User creation failed: Email ${email} already exists`);
        throw new ConflictException('Email already exists');
      }

      const user = await this.userRepository.create({ name, email, password, role: 'admin' });
      
      this.logger.log(`User created successfully: ${user.id}`);
      return user;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      this.logger.error(`Failed to create user: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  // Retrieve all users
  async findAll(): Promise<User[]> {
    try {
      const users = await this.userRepository.findAll();
      this.logger.log('Retrieved all users');
      return users;
    } catch (error) {
      this.logger.error(`Failed to retrieve users: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve users');
    }
  }

  // Find a user by ID
  async findById(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findByPk(id);
      if (!user) {
        this.logger.warn(`User with ID ${id} not found`);
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      this.logger.log(`Retrieved user with ID ${id}`);
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to retrieve user with ID ${id}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve user');
    }
  }

  // Find a user by email
  async findByEmail(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        this.logger.warn(`User with email ${email} not found`);
        throw new NotFoundException(`User with email ${email} not found`);
      }
      this.logger.log(`Retrieved user with email ${email}`);
      return user;
    } catch (error) {
      this.logger.error(`Failed to retrieve user with email ${email}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve user by email');
    }
  }

  // Update a user's password
  async updatePassword(id: number, newPassword: string): Promise<void> {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const [affectedRows] = await this.userRepository.update({ password: hashedPassword }, {
        where: { id },
      });

      if (affectedRows === 0) {
        this.logger.warn(`User with ID ${id} not found for password update`);
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      this.logger.log(`Password for user with ID ${id} updated successfully`);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to update password for user with ID ${id}`, error.stack);
      throw new InternalServerErrorException('Failed to update user password');
    }
  }

  // Method to get user progress and ranking
  async getUserProgress(id: number): Promise<any> {
    try {
      // Logic to fetch and calculate user progress can be implemented here
      const progress = {};  // Mock progress data

      this.logger.log(`Retrieved progress for user with ID ${id}`);
      return progress;
    } catch (error) {
      this.logger.error(`Failed to retrieve progress for user with ID ${id}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve user progress');
    }
  }

  // Method to update the role of a user
  async updateUserRole(id: number, newRole: string): Promise<User> {
    const user = await this.userRepository.findByPk(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    user.role = newRole;
    await user.save();
    return user;
  }
}
