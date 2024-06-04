import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { usersProviders } from './users.providers';
import { CreateUserDto } from './dto/create-user.dto';
import { DatabaseModule } from '../database.module';
import { User } from './entities/user.entity';

describe('UserService', () => {
  let service: UserService;
  const testUser: CreateUserDto = {
    firstName: 'Israel',
    lastName: 'Israely',
    userName: 'tzabar',
    password: '1948',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [UserService, ...usersProviders],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create new test user', async () => {
    const result = await service.create(testUser);
    expect(result).toBeDefined();
    expect(result.id).toBeGreaterThan(0);
    testUser.id = result.id;
    validateTestUser(result, testUser);
  });

  it('should find test user by id', async () => {
    const result = await service.findOne(testUser.id);
    expect(result).toBeDefined();
    expect(result.id).toBe(testUser.id);
    validateTestUser(result, testUser);
  });

  it('should find test user by user name and password', async () => {
    const result = await service.findByUserNameAndPassword(
      testUser.userName,
      testUser.password,
    );
    expect(result).toBeDefined();
    validateTestUser(result, testUser);
  });

  it('should delete test user', async () => {
    const result = await service.remove(testUser.id);
    expect(result).toBe(1);
  });
});
function validateTestUser(result: User, testUser: CreateUserDto) {
  expect(result.firstName).toBe(testUser.firstName);
  expect(result.lastName).toBe(testUser.lastName);
  expect(result.userName).toBe(testUser.userName);
}
