
import { TOPIC_REPOSITORY } from '../../core/constants'; 
import { Topic } from '../topic/topic.model';

export const topicProviders = [
  {
    provide: TOPIC_REPOSITORY,
    useValue: Topic,
  }
];