import { IsString, IsNotEmpty, IsUrl, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTopicDto {
  @ApiProperty({ example: 'Introduction to Math', description: 'Title of the topic' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'A brief introduction to mathematics', description: 'Description of the topic' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'https://video-url.com/math-intro', description: 'Video URL of the topic' })
  @IsString()
  @IsOptional()
  videoUrl?: string;

  @ApiProperty({ example: 1, description: 'ID of the subject the topic belongs to' })
  @IsString()
  @IsNotEmpty()
  subjectId: number;
}
