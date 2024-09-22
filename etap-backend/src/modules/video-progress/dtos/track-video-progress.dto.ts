import { IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TrackVideoProgressDto {
  @ApiProperty({ example: 50, description: 'Percentage of the video watched by the user' })
  @IsNumber()
  @Min(0)
  @Max(100)
  watchTimePercentage: number;
}
