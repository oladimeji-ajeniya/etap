import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { userProviders } from './user.provider';

@Module({
  providers: [UserService, ...userProviders],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}