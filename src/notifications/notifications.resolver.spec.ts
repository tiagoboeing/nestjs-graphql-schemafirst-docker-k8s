import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PUB_SUB } from '../infra/redis-pubsub/redis-pubsub.module';
import { NotificationsResolver } from './notifications.resolver';
import { NotificationsService } from './notifications.service';

describe('NotificationsResolver', () => {
  let resolver: NotificationsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        NotificationsResolver,
        ConfigService,
        {
          provide: NotificationsService,
          useValue: jest.fn(),
        },
        {
          provide: PUB_SUB,
          useValue: jest.fn(),
        },
      ],
    }).compile();

    resolver = module.get<NotificationsResolver>(NotificationsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
