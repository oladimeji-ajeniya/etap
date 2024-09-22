import { IsString, IsEmail, IsOptional, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'John Doe', description: 'Updated name of the user' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'john.doe@example.com', description: 'Updated email of the user' })
  @IsEmail()
  @IsOptional()
  email?: string;
}
