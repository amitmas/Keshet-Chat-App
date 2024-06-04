import { Test, TestingModule } from '@nestjs/testing';
import { TwilioService } from './twilio.service';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { usersProviders } from '../user/users.providers';

fdescribe('TwilioService', () => {
  let service: TwilioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TwilioService, ConfigService, UserService, ...usersProviders],
    }).compile();

    service = module.get<TwilioService>(TwilioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  xit('should create new chat', async () => {
    const chat = await service.createChat('new test chat');
    expect(chat).toBeDefined();
    const result = await chat.remove();
    expect(result).toBeTruthy();
  });

  xit('should list all chats', async () => {
    const chat = await service.createChat('new test chat');
    expect(chat).toBeDefined();
    const list = await service.getChats();
    expect(list).toBeDefined();
    expect(list.length).toBeGreaterThanOrEqual(1);
    const result = await chat.remove();
    expect(result).toBeTruthy();
  });

  xit('should delete all chats', async () => {
    await service.deleteAllChats();
    const list = await service.getChats();
    expect(list.length).toBe(0);
  });

  xit('should delete all users', async () => {
    await service.deleteAllUsers();
    expect(service.client.conversations.v1.users.length).toBe(1);
  });
});
