import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { TwilioService } from '../twilio/twilio.service';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { usersProviders } from '../user/users.providers';

@Module({
  controllers: [ChatController],
  providers: [TwilioService, ConfigService, UserService, ...usersProviders],
})
export class ChatModule {}
