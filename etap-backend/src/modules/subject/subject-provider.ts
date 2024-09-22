
import { SUBJECT_REPOSITORY, VIDEO_PROGRESS_REPOSITORY } from '../../core/constants'; 
import { VideoProgress } from '../video-progress/video-progress.model';
import { Subject } from './subject.model';

export const subjectProviders = [
  {
    provide: SUBJECT_REPOSITORY,
    useValue: Subject,
  },
  {
    provide : VIDEO_PROGRESS_REPOSITORY,
    useValue: VideoProgress
  }
];