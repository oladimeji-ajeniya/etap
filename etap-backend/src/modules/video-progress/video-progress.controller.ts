import { Controller, Post, Body, Param, Get, ParseIntPipe, UseGuards, InternalServerErrorException, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse } from '@nestjs/swagger';
import { VideoProgressService } from './video-progress.service';
import { VideoProgress } from './video-progress.model';
import { TrackVideoProgressDto } from './dtos/track-video-progress.dto';
import { AuthGuard } from '@nestjs/passport';
import { PaginationDto } from './dtos/pagination.dto';
import { UserRankingDto } from './dtos/user-ranking.dto';

@ApiTags('Video Progress')
@UseGuards(AuthGuard())
@Controller('video-progress')
export class VideoProgressController {
  constructor(private readonly videoProgressService: VideoProgressService) {}

  @Post(':userId/:topicId')
  @ApiOperation({ summary: 'Track video progress for a user' })
  @ApiParam({ name: 'userId', type: 'number', description: 'ID of the user' })
  @ApiParam({ name: 'topicId', type: 'number', description: 'ID of the topic/video' })
  @ApiBody({ type: TrackVideoProgressDto })
  @ApiResponse({ status: 201, description: 'Progress tracked successfully', type: VideoProgress })
  async trackProgress(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('topicId', ParseIntPipe) topicId: number,
    @Body() trackVideoProgressDto: TrackVideoProgressDto,
  ): Promise<VideoProgress> {
    return this.videoProgressService.trackVideoProgress(userId, topicId, trackVideoProgressDto.watchTimePercentage);
  }

  // Endpoint to get video progress for a user
  @Get(':userId/:topicId')
  @ApiOperation({ summary: 'Get video progress for a user' })
  @ApiParam({ name: 'userId', type: 'number', description: 'ID of the user' })
  @ApiParam({ name: 'topicId', type: 'number', description: 'ID of the topic/video' })
  @ApiResponse({ status: 200, description: 'Progress retrieved successfully', type: VideoProgress })
  async getProgress(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('topicId', ParseIntPipe) topicId: number,
  ): Promise<VideoProgress> {
    return this.videoProgressService.getVideoProgress(userId, topicId);
  }

  @Get()
    @ApiOperation({ summary: 'Get user rankings based on video watch time' })
    @ApiResponse({ status: 200, description: 'Ranking data retrieved successfully.'})
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    async getRanking(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    ): Promise<any[]> {
        const paginationDto = new PaginationDto();
        paginationDto.limit = limit;

        try {
            return await this.videoProgressService.getRanking(page, paginationDto, paginationDto, limit);
        } catch (error) {
            throw new InternalServerErrorException('Failed to get rankings');
        }
    }
}
