import { createMock } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';
import {
  HealthCheckService,
  HealthIndicatorResult,
  MicroserviceHealthIndicator,
} from '@nestjs/terminus';
import { Test, TestingModule } from '@nestjs/testing';
import environments from '../environments';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  const spyMicroserviceHealth = createMock<MicroserviceHealthIndicator>({
    pingCheck: jest.fn(),
  });

  const spyHealthService = createMock<HealthCheckService>({
    check: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: HealthCheckService,
          useValue: spyHealthService,
        },
        {
          provide: MicroserviceHealthIndicator,
          useValue: spyMicroserviceHealth,
        },
        {
          provide: ConfigService,
          useValue: createMock<ConfigService>({
            get: (prop: string): string =>
              ({
                [environments.redis.host]: 'redis',
                [environments.redis.username]: 'redis',
              }[prop]),
          }),
        },
      ],
      controllers: [HealthController],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('check()', () => {
    test('should ping Redis', async () => {
      spyMicroserviceHealth.pingCheck.mockResolvedValue({
        redis: {
          status: 'up',
        },
      } as HealthIndicatorResult);

      await controller.check();

      expect(spyHealthService.check).toHaveBeenCalled();
      expect(spyMicroserviceHealth.pingCheck).toHaveBeenCalledWith(
        'redis',
        expect.anything(),
      );
    });
  });
});
