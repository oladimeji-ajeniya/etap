import { Module } from '@nestjs/common';
import { TopicService } from './topic.service';
import { TopicController } from './topic.controller';
import { topicProviders } from './topic.provider';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [TopicService, ...topicProviders],
  controllers: [TopicController],
  exports: [TopicService]
})
export class TopicModule {}
