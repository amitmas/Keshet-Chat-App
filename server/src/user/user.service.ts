import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { constants } from '../constants';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject(constants.repositories.users)
    private usersRepository: typeof User,
  ) {}

  async get() {
    return await this.usersRepository.findAll();
  }

  async create(createUserDto: CreateUserDto) {
    return await this.usersRepository.create(createUserDto);
  }

  async findOne(id: number) {
    return await this.usersRepository.findOne({ where: { id } });
  }

  async findByUserNameAndPassword(userName: string, password: string) {
    return await this.usersRepository.findOne({
      where: { userName, password },
      attributes: { exclude: ['password'] },
    });
  }

  async remove(id: number) {
    return await this.usersRepository.destroy({ where: { id } });
  }
}
