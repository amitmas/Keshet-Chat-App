import { constants } from '../constants';
import { User } from './entities/user.entity';

export const usersProviders = [
  {
    provide: constants.repositories.users,
    useValue: User,
  },
];
