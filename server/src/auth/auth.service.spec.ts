import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { usersProviders } from '../user/users.providers';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from './auth.module';
import { TwilioService } from '../twilio/twilio.service';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
      providers: [
        AuthService,
        TwilioService,
        ConfigService,
        UserService,
        ...usersProviders,
        JwtService,
      ],
    }).compile();
    jest.useFakeTimers();
    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', async () => {
    expect(authService).toBeDefined();
    expect(userService).toBeDefined();
  });

  it('should generate token', async () => {
    const testUser: CreateUserDto = {
      firstName: 'Israel',
      lastName: 'Israely',
      userName: 'tzabar',
      password: '1948',
    };
    const result = await userService.create(testUser);
    expect(result).toBeDefined();
    const token = await authService.signin(
      testUser.userName,
      testUser.password,
    );
    expect(token).toBeDefined();
    expect(token.access_token).toBeDefined();
  });
});
