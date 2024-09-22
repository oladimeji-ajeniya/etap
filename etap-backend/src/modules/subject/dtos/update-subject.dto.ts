import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSubjectDto {
  @ApiPropertyOptional({ example: 'Math', description: 'Title of the subject' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ example: 'Mathematics is the study of numbers', description: 'Description of the subject' })
  @IsString()
  @IsOptional()
  description?: string;
}
