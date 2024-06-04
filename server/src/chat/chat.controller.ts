import { Controller, Post, Body, Get, Put, Req } from '@nestjs/common';
import { TwilioService } from '../twilio/twilio.service';
import IChatView from './models/chat.view';
import { AuthPayload } from 'src/auth/models/AuthPayload';

@Controller('chat')
export class ChatController {
  constructor(private readonly twilioService: TwilioService) {}

  @Post()
  async create(@Body() dto: { friendlyName: string }) {
    const chat = await this.twilioService.createChat(dto.friendlyName);
    return { sid: chat.sid };
  }

  @Get()
  async findAll(): Promise<IChatView[]> {
    return (await this.twilioService.getChats()).map((chat) => ({
      sid: chat.sid,
      friendlyName: chat.friendlyName,
    }));
  }

  @Put('/add')
  async addUserToChat(@Body() dto: { chatId: string }, @Req() request) {
    const user = request['user'] as AuthPayload;
    return await this.twilioService.addUserToChatId(dto.chatId, user);
  }
}
