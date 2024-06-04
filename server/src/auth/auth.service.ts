import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { TwilioService } from '../twilio/twilio.service';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class AuthService {
  public constructor(
    private readonly twilioService: TwilioService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    if (user) return await this.signin(user.userName, user.password);
    throw new BadRequestException();
  }

  async signin(
    userName: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.userService.findByUserNameAndPassword(
      userName,
      password,
    );
    if (!user) {
      return null;
    }
    const payload = {
      sub: user.id,
      userName: user.userName,
      firstName: user.firstName,
      lastName: user.lastName,
      twilioToken: this.twilioService.getClientToken(userName),
    };

    const access_token = this.jwtService.sign(payload);
    return { access_token };
  }
}
