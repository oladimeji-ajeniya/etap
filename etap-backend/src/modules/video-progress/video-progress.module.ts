import { Module } from '@nestjs/common';
import { VideoProgressService } from './video-progress.service';
import { VideoProgressController } from './video-progress.controller';
import { videoProgressProviders } from './video-progress.provider';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [VideoProgressService, ...videoProgressProviders],
  controllers: [VideoProgressController],
  exports: [VideoProgressService],
})
export class VideoProgressModule {}
