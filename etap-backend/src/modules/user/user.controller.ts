import {
    Controller, Get, Param, Body, Put, Delete, ParseIntPipe, ValidationPipe,
    Patch,
  } from '@nestjs/common';
  import { UserService } from './user.service';
  import { User } from './user.model';

  import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UpdateUserRoleDto } from './dtos/update-role.dto';
  
  @ApiTags('Users')  
  @Controller('users')
  export class UserController {
    constructor(private readonly userService: UserService) {}
  
    /**
     * Retrieve all users
     */
    @ApiOperation({ summary: 'Retrieve all users' })
    @ApiResponse({ status: 200, description: 'List of users.', type: [User] })
    @Get()
    async findAll(): Promise<User[]> {
      return this.userService.findAll();
    }
  
    /**
     * Get a user by ID
     * @param id - User ID
     */
    @ApiOperation({ summary: 'Get a user by ID' })
    @ApiResponse({ status: 200, description: 'The user has been successfully retrieved.', type: User })
    @ApiResponse({ status: 404, description: 'User not found.' })
    @Get(':id')
    async findById(
      @Param('id', ParseIntPipe) id: number,  // Parse and validate the 'id' parameter as an integer
    ): Promise<User> {
      return this.userService.findById(id);
    }
  

  
    /**
     * Get a user's progress by ID
     * @param id - User ID
     */
    @ApiOperation({ summary: 'Get user progress by ID' })
    @ApiResponse({ status: 200, description: 'The user progress has been successfully retrieved.' })
    @ApiResponse({ status: 404, description: 'User not found.' })
    @Get(':id/progress')
    async getUserProgress(
      @Param('id', ParseIntPipe) id: number,  // Parse and validate the 'id' parameter
    ): Promise<any> {
      return this.userService.getUserProgress(id);
    }

    // Endpoint to update user role
    @ApiOperation({ summary: 'Update the user role' })
    @ApiResponse({ status: 200, description: 'The user role has been successfully updated.' })
    @ApiResponse({ status: 404, description: 'User not found.' })
    @Patch(':id/role')
    async updateUserRole(@Param('id') id: number, @Body() body: UpdateUserRoleDto): Promise<User> {
      return this.userService.updateUserRole(id, body.role);
    }
  }
  