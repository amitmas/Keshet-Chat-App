import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { Twilio, jwt } from 'twilio';
import { AuthPayload } from 'src/auth/models/AuthPayload';
import { ConversationInstance } from 'twilio/lib/rest/conversations/v1/conversation';

@Injectable()
export class TwilioService {
  get client() {
    return new Twilio(
      this.configService.get('TWILIO_ACCOUNT_SID'),
      this.configService.get('TWILIO_AUTH_TOKEN'),
    );
  }

  public constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {}

  async createChat(friendlyName: string) {
    const chat = await this.client.conversations.v1.conversations.create({
      friendlyName,
    });
    const users = await this.userService.get();
    for (let i = 0; i < users.length; i++) {
      await this.addUserToChat(chat, users[i]);
    }
    return chat;
  }

  async getChats() {
    return await this.client.conversations.v1.conversations.list();
  }

  async addUserToChatId(chatId: string, user: Partial<AuthPayload>) {
    const chat = await this.client.conversations.v1
      .conversations(chatId)
      .fetch();
    return this.addUserToChat(chat, user);
  }

  async addUserToChat(chat: ConversationInstance, user: Partial<AuthPayload>) {
    const participants = await chat.participants().list();
    let participant = participants.find(
      (participant) => participant.identity === user.userName,
    );
    if (!participant)
      participant = await chat
        .participants()
        .create({ identity: user.userName });
    return participant;
  }

  async deleteAllChats() {
    const chats = await this.getChats();
    for (let i = 0; i < chats.length; i++) {
      await chats[i].remove();
    }
  }
  async deleteAllUsers() {
    const users = await this.client.conversations.v1.users.list();
    for (let i = 0; i < users.length; i++) {
      await users[i].remove();
    }
  }

  getClientToken(userName: string) {
    const AccessToken = jwt.AccessToken;
    const ChatGrant = AccessToken.ChatGrant;
    const chatGrant = new ChatGrant({
      serviceSid: this.configService.get('TWILIO_CHAT_SERVICE_SID'),
    });
    const token = new AccessToken(
      this.configService.get('TWILIO_ACCOUNT_SID'),
      this.configService.get('TWILIO_API_KEY'),
      this.configService.get('TWILIO_API_SECRET'),
      { identity: userName },
    );

    token.addGrant(chatGrant);
    return token.toJwt();
  }
}
