import { getQueueToken } from '@nestjs/bull';
import { Test, TestingModule } from '@nestjs/testing';
import { getLoggerToken } from 'nestjs-pino';
import { RedisCacheService } from '../infra/redis-cache/redis-cache.service';
import { PUB_SUB } from '../infra/redis-pubsub/redis-pubsub.module';
import { RedisQueueModule } from '../infra/redis-queue/redis-queue.module';
import { NotificationsService } from './notifications.service';
import { Queue } from 'bull';

describe('NotificationsService', () => {
  jest.useFakeTimers();

  let service: NotificationsService;
  let queue: Queue;

  const spyQueue = {
    add: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RedisQueueModule],
      providers: [
        NotificationsService,
        {
          provide: getLoggerToken(NotificationsService.name),
          useValue: jest.fn(),
        },
        {
          provide: PUB_SUB,
          useValue: jest.fn(),
        },
        {
          provide: RedisCacheService,
          useValue: jest.fn(),
        },
      ],
    })
      .overrideProvider(getQueueToken('notifications-queue'))
      .useValue(spyQueue)
      .compile();

    service = module.get<NotificationsService>(NotificationsService);
    queue = module.get<Queue>(getQueueToken('notifications-queue'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
