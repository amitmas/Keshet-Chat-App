import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './is.public.decorator';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  async signUp(@Body() user: CreateUserDto) {
    const result = await this.authService.signup(user);
    if (!result) throw new UnauthorizedException();
    return result;
  }

  @Public()
  @Post('signin')
  async signIn(@Body() signInDto: Record<string, any>) {
    const result = await this.authService.signin(
      signInDto.userName,
      signInDto.password,
    );
    if (!result) throw new UnauthorizedException();
    return result;
  }
}
