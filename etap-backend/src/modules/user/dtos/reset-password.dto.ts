import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class ResetPasswordDto {
    @ApiProperty({ description: 'The reset token sent to the user', example: 'reset-token' })
    @IsString()
    @IsNotEmpty()
    token: string;

    @ApiProperty({ description: 'The new password for the user', example: 'newpassword123' })
    @IsString()
    @IsNotEmpty()
    newPassword: string;
}
