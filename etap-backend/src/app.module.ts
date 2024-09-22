import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { DatabaseModule } from './core/database/database.module';
import { SubjectModule } from './modules/subject/subject.module';
import { TopicModule } from './modules/topic/topic.module';
import { UserModule } from './modules/user/user.module';
import { CustomLogger } from './logger/custom-logger.service';
import { AuthModule } from './modules/auth/auth.module';
import { VideoProgressModule } from './modules/video-progress/video-progress.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'admin',
      database: process.env.DB_NAME || 'learning',
      autoLoadModels: true,
      synchronize: false, 
      logging: true
    }),
    HealthModule,
    DatabaseModule,
    AuthModule,
    UserModule, 
    SubjectModule, 
    TopicModule,
    VideoProgressModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'LoggerService',
      useClass: CustomLogger,
    },
  ],
})
export class AppModule {}
