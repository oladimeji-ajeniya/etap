import { IsString, IsUrl, IsNumber, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTopicDto {
  @ApiPropertyOptional({ example: 'Updated Math Topic', description: 'Updated title of the topic' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ example: 'Updated description for the topic', description: 'Updated description of the topic' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'https://new-video-url.com', description: 'Updated video URL for the topic' })
  @IsUrl()
  @IsOptional()
  videoUrl?: string;

  @ApiPropertyOptional({ example: 1, description: 'Updated subject ID the topic belongs to' })
  @IsNumber()
  @IsOptional()
  subjectId?: number;
}
