import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'Name of the user' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'Email of the user' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'strongpassword123', description: 'Password of the user' })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  @Exclude({ toPlainOnly: true })
  password: string;
}
