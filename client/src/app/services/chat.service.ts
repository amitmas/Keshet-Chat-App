import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Conversation } from '@twilio/conversations';
import { IChatView } from '../models/chat';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private http: HttpClient) {}

  get() {
    return this.http.get<IChatView[]>('/api/v1/chat');
  }

  create(friendlyName: string) {
    return this.http.post<{ sid: string }>('/api/v1/chat', { friendlyName });
  }

  addUserToChat(chatId: string) {
    return this.http.put<{ conversationSid: string; sid: string }>(
      '/api/v1/chat/add',
      { chatId }
    );
  }
}
