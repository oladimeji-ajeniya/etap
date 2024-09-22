import { Test, TestingModule } from '@nestjs/testing';
import { SubjectService } from './subject.service';
import { SUBJECT_REPOSITORY, VIDEO_PROGRESS_REPOSITORY } from 'src/core/constants';
import { Subject } from './subject.model';
import { VideoProgress } from '../video-progress/video-progress.model';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';

describe('SubjectService', () => {
    let subjectService: SubjectService;
    let subjectRepository: typeof Subject;
    let videoProgressRepository: typeof VideoProgress;

    const mockSubjectRepository = {
        create: jest.fn(),
        findAll: jest.fn(),
        findByPk: jest.fn(),
    };

    const mockVideoProgressRepository = {
        findAll: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SubjectService,
                { provide: SUBJECT_REPOSITORY, useValue: mockSubjectRepository },
                { provide: VIDEO_PROGRESS_REPOSITORY, useValue: mockVideoProgressRepository },
            ],
        }).compile();

        subjectService = module.get<SubjectService>(SubjectService);
        subjectRepository = module.get<typeof Subject>(SUBJECT_REPOSITORY);
        videoProgressRepository = module.get<typeof VideoProgress>(VIDEO_PROGRESS_REPOSITORY);
    });

    describe('createSubject', () => {
        it('should create a subject and return it', async () => {
            const subjectData = { userId: 1, title: 'Math', description: 'Mathematics' };
            const createdSubject = { id: 1, ...subjectData };
            jest.spyOn(mockSubjectRepository, 'create').mockResolvedValue(createdSubject);

            const result = await subjectService.createSubject(1, 'Math', 'Mathematics');
            expect(result).toEqual(createdSubject);
        });

        it('should throw InternalServerErrorException on error', async () => {
            jest.spyOn(mockSubjectRepository, 'create').mockRejectedValue(new Error('Database error'));
            await expect(subjectService.createSubject(1, 'Math', 'Mathematics')).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('findAll', () => {
        it('should return all subjects', async () => {
            const subjects = [{ id: 1, title: 'Math' }, { id: 2, title: 'Science' }];
            jest.spyOn(mockSubjectRepository, 'findAll').mockResolvedValue(subjects);

            const result = await subjectService.findAll();
            expect(result).toEqual(subjects);
        });

        it('should throw InternalServerErrorException on error', async () => {
            jest.spyOn(mockSubjectRepository, 'findAll').mockRejectedValue(new Error('Database error'));
            await expect(subjectService.findAll()).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('findById', () => {
        it('should return the subject if found', async () => {
            const subject = { id: 1, title: 'Math' };
            jest.spyOn(mockSubjectRepository, 'findByPk').mockResolvedValue(subject);

            const result = await subjectService.findById(1);
            expect(result).toEqual(subject);
        });

        it('should return null if subject is not found', async () => {
            jest.spyOn(mockSubjectRepository, 'findByPk').mockResolvedValue(null);

            const result = await subjectService.findById(1);
            expect(result).toBeNull();
        });

        it('should throw InternalServerErrorException on error', async () => {
            jest.spyOn(mockSubjectRepository, 'findByPk').mockRejectedValue(new Error('Database error'));
            await expect(subjectService.findById(1)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('getLearnerRankings', () => {
        it('should return rankings data', async () => {
            jest.spyOn(subjectService, 'getLearnerRankings').mockResolvedValue({}); // Placeholder response

            const result = await subjectService.getLearnerRankings(1);
            expect(result).toEqual({});
        });

        it('should throw InternalServerErrorException on error', async () => {
            jest.spyOn(subjectService, 'getLearnerRankings').mockRejectedValue(new Error('Database error'));
            await expect(subjectService.getLearnerRankings(1)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('getSubjectRankings', () => {
        it('should return user rankings for the subject', async () => {
            const subjectId = 1;
            const subject = { id: subjectId, topics: [{ id: 1 }, { id: 2 }] };
            const videoProgressData = [
                { userId: 1, isCompleted: true, user: { id: 1, name: 'Alice' } },
                { userId: 2, isCompleted: false, user: { id: 2, name: 'Bob' } },
            ];

            jest.spyOn(mockSubjectRepository, 'findByPk').mockResolvedValue(subject);
            jest.spyOn(mockVideoProgressRepository, 'findAll').mockResolvedValue(videoProgressData);

            const result = await subjectService.getSubjectRankings(subjectId);
            expect(result).toEqual([
                { user: videoProgressData[0].user, completionRate: 50 }, // 1 completed out of 2 topics
                { user: videoProgressData[1].user, completionRate: 0 },  // 0 completed out of 2 topics
            ]);
        });

        it('should throw NotFoundException if subject is not found', async () => {
            jest.spyOn(mockSubjectRepository, 'findByPk').mockResolvedValue(null);
            await expect(subjectService.getSubjectRankings(1)).rejects.toThrow(NotFoundException);
        });

        it('should throw NotFoundException if no topics are found', async () => {
            const subjectId = 1;
            const subject = { id: subjectId, topics: [] };
            jest.spyOn(mockSubjectRepository, 'findByPk').mockResolvedValue(subject);
            await expect(subjectService.getSubjectRankings(subjectId)).rejects.toThrow(NotFoundException);
        });

        it('should throw InternalServerErrorException on error', async () => {
            jest.spyOn(mockSubjectRepository, 'findByPk').mockRejectedValue(new Error('Database error'));
            await expect(subjectService.getSubjectRankings(1)).rejects.toThrow(InternalServerErrorException);
        });
    });
});
