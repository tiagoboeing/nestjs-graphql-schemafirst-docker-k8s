import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from 'nestjs-pino';
import { RedisCacheService } from '../infra/redis-cache/redis-cache.service';
import { PUB_SUB } from '../infra/redis-pubsub/redis-pubsub.module';
import { RedisQueueModule } from '../infra/redis-queue/redis-queue.module';
import { NotificationsModule } from './notifications.module';
import { NotificationsResolver } from './notifications.resolver';
import { NotificationsService } from './notifications.service';

describe('NotificationsResolver', () => {
  let resolver: NotificationsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule, LoggerModule.forRoot(), RedisQueueModule],
      providers: [
        NotificationsResolver,
        NotificationsService,
        ConfigService,
        {
          provide: PUB_SUB,
          useValue: jest.fn(),
        },
        {
          provide: RedisCacheService,
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
