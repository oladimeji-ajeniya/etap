import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class RequestResetPasswordDto {
    @ApiProperty({ description: 'The email of the user requesting a password reset', example: 'john.doe@example.com' })
    @IsString()
    @IsNotEmpty()
    email: string;
}
