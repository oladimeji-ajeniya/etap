import { Test, TestingModule } from '@nestjs/testing';
import { TopicService } from './topic.service';
import { TOPIC_REPOSITORY } from 'src/core/constants';
import { Topic } from './topic.model';
import { InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as path from 'path';

describe('TopicService', () => {
    let topicService: TopicService;
    let topicRepository: typeof Topic;

    const mockTopicRepository = {
        create: jest.fn(),
        findAndCountAll: jest.fn(),
        findAll: jest.fn(),
        findByPk: jest.fn(),
    };

    const mockCloudinaryUpload = jest.spyOn(cloudinary.uploader, 'upload_stream');

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TopicService,
                { provide: TOPIC_REPOSITORY, useValue: mockTopicRepository },
            ],
        }).compile();

        topicService = module.get<TopicService>(TopicService);
        topicRepository = module.get<typeof Topic>(TOPIC_REPOSITORY);
    });


    describe('getTopicsBySubjectId', () => {
        it('should return topics by subject ID', async () => {
            const subjectId = 1;
            const topics = [{ id: 1, title: 'Topic 1' }, { id: 2, title: 'Topic 2' }];
            mockTopicRepository.findAndCountAll.mockResolvedValue({ count: topics.length, rows: topics });

            const result = await topicService.getTopicsBySubjectId(subjectId, 1, 10);
            expect(result.topics).toEqual(topics);
            expect(result.total).toBe(topics.length);
        });

        it('should throw NotFoundException if no topics are found', async () => {
            mockTopicRepository.findAndCountAll.mockResolvedValue({ count: 0, rows: [] });
            await expect(topicService.getTopicsBySubjectId(1, 1, 10))
                .rejects.toThrow(NotFoundException);
        });

        it('should throw InternalServerErrorException on error', async () => {
            mockTopicRepository.findAndCountAll.mockRejectedValue(new Error('Database error'));
            await expect(topicService.getTopicsBySubjectId(1, 1, 10))
                .rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('findAll', () => {
        it('should return all topics', async () => {
            const topics = [{ id: 1, title: 'Topic 1' }, { id: 2, title: 'Topic 2' }];
            mockTopicRepository.findAll.mockResolvedValue(topics);

            const result = await topicService.findAll();
            expect(result).toEqual(topics);
        });

        it('should throw InternalServerErrorException on error', async () => {
            mockTopicRepository.findAll.mockRejectedValue(new Error('Database error'));
            await expect(topicService.findAll())
                .rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('findById', () => {
        it('should return the topic if found', async () => {
            const topic = { id: 1, title: 'Topic 1' };
            mockTopicRepository.findByPk.mockResolvedValue(topic);

            const result = await topicService.findById(1);
            expect(result).toEqual(topic);
        });

        it('should throw NotFoundException if topic is not found', async () => {
            mockTopicRepository.findByPk.mockResolvedValue(null);
            await expect(topicService.findById(1))
                .rejects.toThrow(NotFoundException);
        });

        it('should throw InternalServerErrorException on error', async () => {
            mockTopicRepository.findByPk.mockRejectedValue(new Error('Database error'));
            await expect(topicService.findById(1))
                .rejects.toThrow(InternalServerErrorException);
        });
    });
});
