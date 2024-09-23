import { Sequelize } from 'sequelize-typescript';
import { databaseConfig } from './database.config';
import { DEVELOPMENT, PRODUCTION, SEQUELIZE, TEST } from '../constants';
import { Topic } from 'src/modules/topic/topic.model';
import { Subject } from 'src/modules/subject/subject.model';
import { User } from 'src/modules/user/user.model';
import { VideoProgress } from 'src/modules/video-progress/video-progress.model';


export const databaseProviders = [{
    provide: SEQUELIZE,
    useFactory: async () => {
        let config;
        switch (process.env.NODE_ENV) {
        case DEVELOPMENT:
           config = databaseConfig.dev;
           break;
        case TEST:
           config = databaseConfig.test;
           break;
        case PRODUCTION:
           config = databaseConfig.production;
           break;
        default:
           config = databaseConfig.dev;
        }
        const sequelize = new Sequelize(config);
        sequelize.addModels([ Topic, Subject, User, VideoProgress]);
        return sequelize;
    },
}];