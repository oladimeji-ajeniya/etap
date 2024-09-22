import { Inject, Injectable, Logger, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { SUBJECT_REPOSITORY, VIDEO_PROGRESS_REPOSITORY } from 'src/core/constants';
import { Subject } from './subject.model';
import { Topic } from '../topic/topic.model';
import { User } from '../user/user.model';
import { VideoProgress } from '../video-progress/video-progress.model';

@Injectable()
export class SubjectService {
  private readonly logger = new Logger(SubjectService.name);

  constructor(
    @Inject(SUBJECT_REPOSITORY) private readonly subjectRepository: typeof Subject,
    @Inject(VIDEO_PROGRESS_REPOSITORY) private videoProgressRepository: typeof VideoProgress,
  ) {}

  /**
   * Create a new subject with a given title and description.
   * Logs the successful creation or error, if any.
   * 
   * @param title - Title of the subject
   * @param description - Description of the subject
   * @returns The created Subject instance
   */
  async createSubject(userId: number, title: string, description: string): Promise<Subject> {
    try {
      const subject = await this.subjectRepository.create({userId, title, description });
      this.logger.log(`Created subject with title: ${title}`);
      return subject;
    } catch (error) {
      this.logger.error(`Failed to create subject: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to create subject');
    }
  }

  /**
   * Retrieve all subjects, including their associated topics.
   * Logs the successful retrieval or error, if any.
   * 
   * @returns An array of Subject instances
   */
  async findAll(): Promise<Subject[]> {
    try {
      const subjects = await this.subjectRepository.findAll({ include: [Topic] });
      this.logger.log('Fetched all subjects');
      return subjects;
    } catch (error) {
      this.logger.error(`Failed to fetch subjects: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to fetch subjects');
    }
  }

  /**
   * Find a subject by its ID, including its associated topics.
   * Logs whether the subject was found or not, or if an error occurred.
   * 
   * @param id - The ID of the subject to retrieve
   * @returns The Subject instance if found, or null if not found
   */
  async findById(id: number): Promise<Subject> {
    try {
      const subject = await this.subjectRepository.findByPk(id, { include: [Topic] });
      if (subject) {
        this.logger.log(`Found subject with ID: ${id}`);
      } else {
        this.logger.warn(`No subject found with ID: ${id}`);
      }
      return subject;
    } catch (error) {
      this.logger.error(`Failed to fetch subject with ID: ${id} - ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to fetch subject');
    }
  }


  /**
   * Get learner rankings for a specific subject based on topic completion.
   * Logs the operation or error, if any.
   * 
   * @param subjectId - The ID of the subject to fetch rankings for
   * @returns The rankings data (placeholder in this case)
   */
  async getLearnerRankings(subjectId: number): Promise<any> {
    try {
      // Ranking logic based on completed topics
      this.logger.log(`Fetched rankings for subject with ID: ${subjectId}`);
      return {}; // placeholder
    } catch (error) {
      this.logger.error(`Failed to fetch rankings for subject with ID: ${subjectId} - ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to fetch learner rankings');
    }
  }


  // Method to get user rankings for a given subject
  async getSubjectRankings(subjectId: number): Promise<any[]> {
    // Find the subject with its topics
    const subject = await this.subjectRepository.findByPk(subjectId, {
      include: [Topic],
    });

    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    // Get the total number of topics in the subject
    const totalTopics = subject.topics.length;

    if (totalTopics === 0) {
      throw new NotFoundException('No topics found for this subject');
    }

    // Find all users and their progress in the subject's topics
    const videoProgress = await this.videoProgressRepository.findAll({
      include: [{ model: User }, { model: Topic, where: { subjectId } }],
    });

    // Calculate completion rates for each user
    const userRankings = videoProgress.reduce((rankings, progress) => {
      const userId = progress.userId;
      const isCompleted = progress.isCompleted;

      if (!rankings[userId]) {
        rankings[userId] = { user: progress.user, completedTopics: 0 };
      }

      if (isCompleted) {
        rankings[userId].completedTopics += 1;
      }

      return rankings;
    }, {});

    // Convert rankings object to array and calculate completion rate
    const rankingsArray = Object.values(userRankings).map((userProgress: any) => ({
      user: userProgress.user,
      completionRate: (userProgress.completedTopics / totalTopics) * 100,
    }));

    // Sort users by completion rate in descending order
    rankingsArray.sort((a, b) => b.completionRate - a.completionRate);

    return rankingsArray;
  }

}
