import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';
import { TwilioService } from './twilio/twilio.service';
import { UserService } from './user/user.service';
import { usersProviders } from './user/users.providers';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, UserModule, ChatModule],
  controllers: [AppController],
  providers: [
    AppService,
    ConfigService,
    TwilioService,
    UserService,
    ...usersProviders,
  ],
})
export class AppModule {}
