import { Module } from '@nestjs/common';
import { SubjectController } from './subject.controller';
import { SubjectService } from './subject.service';
import { subjectProviders } from './subject-provider';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [SubjectService, ...subjectProviders],
  controllers: [SubjectController],
  exports: [SubjectService],
})
export class SubjectModule {}
