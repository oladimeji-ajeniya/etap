import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  Delete,
  ParseIntPipe,
  UseInterceptors,
  ValidationPipe,
  UploadedFiles,
  BadRequestException,
  InternalServerErrorException,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { TopicService } from './topic.service';
import { Topic } from './topic.model';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { CreateTopicDto } from './dtos/create-topic.dto';
import { UpdateTopicDto } from './dtos/update-topic.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Topics')
@UseGuards(AuthGuard())
@Controller('topics')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @ApiOperation({ summary: 'Create a new topic with video upload' })
  @ApiResponse({
    status: 201,
    description: 'The topic has been successfully created with video upload.',
    type: Topic,
  })
  @ApiResponse({ status: 400, description: 'Validation failed.' })
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'videos', maxCount: 5 }], {
      limits: { fileSize: 50 * 1024 * 1024 },
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.startsWith('video/')) {
          return callback(new BadRequestException('Only video files are allowed!'), false);
        }
        callback(null, true);
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  async createTopic(
    @Body(ValidationPipe) body: CreateTopicDto,
    @UploadedFiles() files: { videos?: Express.Multer.File[] },
  ): Promise<Topic[]> {
    try {
  
      // Check if files are uploaded
      if (!files || !files.videos || files.videos.length === 0) {
        throw new BadRequestException('No video files uploaded');
      }
  
      // Call the service method to create the topic
      return await this.topicService.createTopic(
        body.title, 
        body.description, 
        files.videos, 
        body.subjectId
      );
    } catch (error) {
      // Handle specific exceptions if needed or throw a generic error
      if (error instanceof BadRequestException) {
        throw error; // re-throwing bad request exception
      } else {
        // Log error if necessary, then throw an internal server error
        console.error('Error creating topic:', error);
        throw new InternalServerErrorException('An error occurred while creating the topic');
      }
    }
  }

  /**
   * Get all topics by subject ID with pagination
   * @param subjectId - ID of the subject
   * @param page - Current page number
   * @param limit - Number of topics per page
   */
  @ApiOperation({ summary: 'Get all topics by subject ID with pagination' })
  @ApiResponse({ status: 200, description: 'List of topics for the subject' })
  @ApiResponse({ status: 404, description: 'No topics found for the subject ID' })
  @Get('subject/:subjectId')
  async getTopicsBySubjectId(
    @Param('subjectId', ParseIntPipe) subjectId: number,
    @Query('page', new ParseIntPipe()) page: number = 1, 
    @Query('limit', new ParseIntPipe()) limit: number = 10,
  ): Promise<{ topics: Topic[], total: number }> {
    return this.topicService.getTopicsBySubjectId(subjectId, page, limit);
  }

  /**
   * Retrieve all topics
   */
  @ApiOperation({ summary: 'Retrieve all topics' })
  @ApiResponse({ status: 200, description: 'List of topics.', type: [Topic] })
  @Get()
  async findAll(): Promise<Topic[]> {
    return this.topicService.findAll();
  }

  /**
   * Get a topic by ID
   * @param id - Topic ID
   */
  @ApiOperation({ summary: 'Get a topic by ID' })
  @ApiResponse({
    status: 200,
    description: 'The topic has been successfully retrieved.',
    type: Topic,
  })
  @ApiResponse({ status: 404, description: 'Topic not found.' })
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<Topic> {
    return this.topicService.findById(id);
  }



}
