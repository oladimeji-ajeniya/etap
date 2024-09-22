import {
    Controller, Get, Post, Param, Body, Put, Delete,
    ParseIntPipe, ValidationPipe,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Subject } from './subject.model';
import { SubjectService } from './subject.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateSubjectDto } from './dtos/create-subject.dto';
import { UpdateSubjectDto } from './dtos/update-subject.dto';
  
@ApiTags('Subjects')
@UseGuards(AuthGuard())
@Controller('subjects')
export class SubjectController {
    constructor(private readonly subjectService: SubjectService) {}
  
    /**
     * Create a new subject
     * @param body - CreateSubjectDto
     */
    @ApiOperation({ summary: 'Create a new subject' })
    @ApiResponse({ status: 201, description: 'The subject has been successfully created.', type: Subject })
    @ApiResponse({ status: 400, description: 'Validation failed.' })
    @Post()
    async createSubject(
      @Body(ValidationPipe) body: CreateSubjectDto,
    ): Promise<Subject> {
      return this.subjectService.createSubject(body.userId, body.title, body.description);
    }
  
    /**
     * Get all subjects
     */
    @ApiOperation({ summary: 'Retrieve all subjects' })
    @ApiResponse({ status: 200, description: 'List of subjects.', type: [Subject] })
    @Get()
    async findAll(): Promise<Subject[]> {
      return this.subjectService.findAll();
    }
  
    /**
     * Get a subject by ID
     * @param id - Subject ID
     */
    @ApiOperation({ summary: 'Get subject by ID' })
    @ApiResponse({ status: 200, description: 'The subject has been successfully retrieved.', type: Subject })
    @ApiResponse({ status: 404, description: 'Subject not found.' })
    @Get(':id')
    async findById(
      @Param('id', ParseIntPipe) id: number,
    ): Promise<Subject> {
      return this.subjectService.findById(id);
    }
  
  
    /**
     * Get learner rankings for a subject
     * @param id - Subject ID
     */
    @ApiOperation({ summary: 'Get learner rankings for a subject' })
    @ApiResponse({ status: 200, description: 'The learner rankings for the subject.', type: Object })
    @Get(':id/rankings')
    async getLearnerRankings(
      @Param('id', ParseIntPipe) id: number,
    ): Promise<any> {
      return this.subjectService.getSubjectRankings(id);
    }

}
  