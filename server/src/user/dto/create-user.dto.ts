import { Optional } from 'sequelize';
import { UserAttributes } from '../entities/user.entity';

export type CreateUserDto = Optional<UserAttributes, 'id'>;
