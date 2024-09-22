import { Inject, Injectable, NotFoundException, InternalServerErrorException, Logger } from '@nestjs/common';
import { VideoProgress } from './video-progress.model';
import { VIDEO_PROGRESS_REPOSITORY } from 'src/core/constants';
import { User } from '../user/user.model';
import { Sequelize } from 'sequelize-typescript';
import { PaginationDto } from './dtos/pagination.dto';

@Injectable()
export class VideoProgressService {
  private readonly logger = new Logger(VideoProgressService.name);

  constructor(
    @Inject(VIDEO_PROGRESS_REPOSITORY) private readonly videoProgressRepository: typeof VideoProgress,
    private readonly sequelize: Sequelize
  ) {}

  // Track or update the video progress for a user
  async trackVideoProgress(userId: number, topicId: number, watchTimePercentage: number): Promise<VideoProgress> {
    try {
      this.logger.log(`Tracking video progress for userId: ${userId}, topicId: ${topicId}, watchTimePercentage: ${watchTimePercentage}`);

      const videoProgress = await this.videoProgressRepository.findOne({
        where: { userId, topicId },
      });

      // If the record exists, update it
      if (videoProgress) {
        videoProgress.watchTimePercentage = watchTimePercentage;
        if (watchTimePercentage === 100) {
          videoProgress.isCompleted = true;
        }
        await videoProgress.save();
        this.logger.log(`Video progress updated for userId: ${userId}, topicId: ${topicId}`);
        return videoProgress;
      }

      // If no progress exists, create a new record
      const isCompleted = watchTimePercentage === 100;
      const newProgress = await this.videoProgressRepository.create({
        userId,
        topicId,
        watchTimePercentage,
        isCompleted,
      });
      this.logger.log(`New video progress created for userId: ${userId}, topicId: ${topicId}`);
      return newProgress;
    } catch (error) {
      this.logger.error(`Failed to track video progress for userId: ${userId}, topicId: ${topicId}. Error: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to track video progress');
    }
  }

  // Get the video progress for a user
  async getVideoProgress(userId: number, topicId: number): Promise<VideoProgress> {
    try {
      this.logger.log(`Fetching video progress for userId: ${userId}, topicId: ${topicId}`);

      const progress = await this.videoProgressRepository.findOne({ where: { userId, topicId } });
      if (!progress) {
        this.logger.warn(`Video progress not found for userId: ${userId}, topicId: ${topicId}`);
        throw new NotFoundException('Video progress not found');
      }

      this.logger.log(`Video progress retrieved for userId: ${userId}, topicId: ${topicId}`);
      return progress;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(`Failed to retrieve video progress for userId: ${userId}, topicId: ${topicId}. Error: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve video progress');
    }
  }

  async getRanking(page: number, pagination: PaginationDto, PaginationDto: PaginationDto, limit: number): Promise<any[]> {
    try {
        // Fetch total watch time for each user
        const userWatchTimes = await VideoProgress.findAll({
            attributes: [
                'userId',
                [this.sequelize.fn('SUM', this.sequelize.col('watchTimePercentage')), 'totalWatchTime'],
            ],
            group: ['userId'],
            raw: true,
        });

        // Fetch user details for each user
        const rankings = await Promise.all(
            userWatchTimes.map(async (record: any) => {
                const user = await User.findByPk(record.userId);
                return {
                    userId: user?.id, // Use optional chaining
                    name: user?.name,
                    email: user?.email,
                    totalWatchTime: record.totalWatchTime || 0, // Handle cases with no watch time
                };
            }),
        );

        // Sort rankings by total watch time
        rankings.sort((a, b) => b.totalWatchTime - a.totalWatchTime);

        // Pagination logic
        const startIndex = (page - 1) * limit;
        const paginatedRankings = rankings.slice(startIndex, startIndex + limit);

        return paginatedRankings;
    } catch (error) {
        throw new InternalServerErrorException('Failed to get rankings', error.message);
    }
  }

}
