import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../material.module';
import { AuthService } from '../services/auth.service';
import { Client, Conversation, Message, User } from '@twilio/conversations';
import { MatDialog } from '@angular/material/dialog';
import { NewChatDialogComponent } from './new-chat-dialog/new-chat-dialog.component';
import { FormsModule } from '@angular/forms';
import IUser from '../models/user';
import { ChatService } from '../services/chat.service';
import { IChatView } from '../models/chat';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [MaterialModule, FormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit {
  twilio!: Client;
  chats?: IChatView[];
  selectedChatView?: IChatView;
  selectedChat?: Conversation;
  messages?: Message[];
  newMessage?: string;
  user!: IUser;
  chatUser?: User;

  constructor(
    private authService: AuthService,
    public dialog: MatDialog,
    private chatService: ChatService
  ) {}

  async ngOnInit(): Promise<void> {
    this.user = this.authService.getUser()!;
    this.twilio = new Client(this.user!.twilioToken);
    this.twilio.on('connectionStateChanged', (state) =>
      console.log('Twilio connection state changed: ', state)
    );
    this.twilio.on('connectionError', (error: any) => {
      if (error!.httpStatusCode === 401) this.authService.signout();
      console.error(error);
    });
    this.twilio.on('initialized', async () => {
      this.twilio
        .getUser(this.user.userName)
        .then((user) => (this.chatUser = user))
        .catch((err) => console.error(err));
      this.reloadChatsList();
      this.handleIncommingMessages();
      this.twilio.on('conversationAdded', (conversation) => {
        console.log('new conversation added, ', conversation.friendlyName);
        if (this.chats?.some((c) => c.sid === conversation.sid)) return;
        this.chats?.push({
          sid: conversation.sid,
          friendlyName: '' + conversation.friendlyName,
        });
      });
    });
  }

  private reloadChatsList() {
    return this.chatService.get().subscribe((chats) => (this.chats = chats));
  }

  async setSelectedChat(chatView: IChatView) {
    this.selectedChatView = chatView;
    this.messages = undefined;
    this.chatService
      .addUserToChat(chatView.sid)
      .subscribe(async (participant) => {
        try {
          this.selectedChat = await this.twilio.getConversationBySid(
            participant.conversationSid
          );
          const messages = await this.selectedChat.getMessages();
          this.messages = messages.items || [];
        } catch (error) {
          console.error(error);
        }
      });
  }

  async sendNewMessage() {
    if (!this.selectedChat || !this.newMessage || this.newMessage?.length < 1)
      return;
    await this.selectedChat.sendMessage(this.newMessage);
    this.newMessage = undefined;
  }

  handleIncommingMessages() {
    this.twilio.on('messageAdded', async (msg: Message) => {
      console.log('Message added', msg);
      if (this.selectedChat?.sid === msg.conversation.sid) {
        this.messages!.push(msg);
        await this.selectedChat.updateLastReadMessageIndex(msg.index);
      }
    });
  }

  createChat() {
    this.dialog
      .open(NewChatDialogComponent)
      .afterClosed()
      .subscribe(async (result) => {
        if (result?.length > 0) {
          this.chatService.create(result).subscribe(async ({ sid }) => {
            this.reloadChatsList();
          });
        }
      });
  }

  signout() {
    this.authService.signout();
  }
}
