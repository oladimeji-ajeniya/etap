import { Injectable, Logger, InternalServerErrorException, NotFoundException, Inject, BadRequestException } from '@nestjs/common';
import { Topic } from './topic.model';
import { TOPIC_REPOSITORY } from 'src/core/constants';
import { v2 as cloudinary } from 'cloudinary';
import * as path from 'path';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

@Injectable()
export class TopicService {
  private readonly logger = new Logger(TopicService.name);

  constructor(
    @Inject(TOPIC_REPOSITORY) private readonly topicRepository: typeof Topic,
  ) {}


  async createTopic(
    title: string, 
    description: string, 
    videos: Express.Multer.File[], 
    subjectId: number
  ): Promise<Topic[]> {
    if (!videos || videos.length === 0) {
      throw new BadRequestException('No video files uploaded');
    }
  
    const uploadResults = [];
  
    try {
      // Process each video in the array of uploaded videos
      for (const video of videos) {
        if (!video || !video.originalname) {
          throw new BadRequestException('Uploaded file is invalid or missing.');
        }
  
        // Create a unique file name based on the original name and timestamp
        const fileExt = path.extname(video.originalname);
        const fileName = `${path.basename(video.originalname, fileExt)}-${Date.now()}${fileExt}`;
  
        // Upload video to Cloudinary
        const uploadResult = await this.uploadToCloudinary(video.buffer, {
          resource_type: 'video',
          folder: 'videos',
          use_filename: true,
          public_id: fileName,
        });
  
        const videoUrl = uploadResult.secure_url;
  
        // Create a new Topic entry for each video
        const topic = await this.topicRepository.create({
          title,
          description,
          video_url: videoUrl, 
          subjectId,
        });
  
        console.log('topic', topic);
        uploadResults.push(topic);
      }
  
      return uploadResults;
  
    } catch (error) {
      console.error(`Failed to create topic: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to create topic with video upload');
    }
  }
  
  private async uploadToCloudinary(buffer: Buffer, options: object): Promise<any> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(options, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }).end(buffer);
    });
  }

   
  async getTopicsBySubjectId(subjectId: number, page: number, limit: number): Promise<{ topics: Topic[], total: number }> {
    try {
      const offset = (page - 1) * limit;
      const { count, rows } = await this.topicRepository.findAndCountAll({
        where: { subjectId },
        limit,
        offset,
      });

      if (count === 0) {
        throw new NotFoundException(`No topics found for subject ID ${subjectId}`);
      }

      return { topics: rows, total: count };
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch topics by subject ID');
    }
  }

  async findAll(): Promise<Topic[]> {
    try {
      const topics = await this.topicRepository.findAll();
      this.logger.log('Fetched all topics');
      return topics;
    } catch (error) {
      this.logger.error(`Failed to fetch topics: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to fetch topics');
    }
  }

  async findById(id: number): Promise<Topic> {
    try {
      const topic = await this.topicRepository.findByPk(id);
      if (!topic) {
        this.logger.warn(`Topic with ID ${id} not found`);
        throw new NotFoundException(`Topic with ID ${id} not found`);
      }
      this.logger.log(`Found topic with ID: ${id}`);
      return topic;
    } catch (error) {
      this.logger.error(`Failed to fetch topic with ID: ${id} - ${error.message}`, error.stack);
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Failed to fetch topic');
    }
  }

}

