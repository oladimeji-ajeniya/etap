import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdatePasswordDto {
    @ApiProperty({ description: 'The user ID', example: '12345' })
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @ApiProperty({ description: 'The current password of the user', example: 'oldpassword123' })
    @IsString()
    @IsNotEmpty()
    currentPassword: string;

    @ApiProperty({ description: 'The new password for the user', example: 'newpassword123' })
    @IsString()
    @IsNotEmpty()
    newPassword: string;
}
