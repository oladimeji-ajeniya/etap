import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubjectDto {
  @ApiProperty({ example: '1', description: 'The user that create the subject' })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ example: 'Math', description: 'Title of the subject' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Mathematics is the study of numbers', description: 'Description of the subject' })
  @IsString()
  @IsNotEmpty()
  description: string;
}
