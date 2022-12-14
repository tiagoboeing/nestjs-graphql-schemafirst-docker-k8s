import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from 'nestjs-pino';
import { RedisCacheService } from '../infra/redis-cache/redis-cache.service';
import { PUB_SUB } from '../infra/redis-pubsub/redis-pubsub.module';
import { RedisQueueModule } from '../infra/redis-queue/redis-queue.module';
import { NotificationsService } from './notifications.service';

describe('NotificationsService', () => {
  let service: NotificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule.forRoot(), RedisQueueModule],
      providers: [
        NotificationsService,
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

    service = module.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
