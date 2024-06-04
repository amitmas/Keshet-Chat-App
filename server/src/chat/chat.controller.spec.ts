import { Test, TestingModule } from '@nestjs/testing';
import { ChatController } from './chat.controller';
import { TwilioService } from '../twilio/twilio.service';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { usersProviders } from '../user/users.providers';

describe('ChatController', () => {
  let controller: ChatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [TwilioService, ConfigService, UserService, ...usersProviders],
    }).compile();

    controller = module.get<ChatController>(ChatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
