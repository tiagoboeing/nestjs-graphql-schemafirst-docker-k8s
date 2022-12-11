import { BullModule } from '@nestjs/bull';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import environments from '../../@core/environments';

@Module({
  imports: [
    BullModule.registerQueue(
      // TODO: you need to register each queue here
      { name: 'your-first-queue-name-here' },
      { name: 'your-second-queue-name-here' },
    ),
  ],
  exports: [BullModule],
})
export class RedisQueueModule {
  static forRoot(): DynamicModule {
    return {
      module: BullModule,
      imports: [
        BullModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (config: ConfigService) => ({
            redis: {
              host: config.get(environments.redis.host),
              port: +config.get(environments.redis.port) || 6379,
              username: config.get(environments.redis.username),
            },
          }),
        }),
      ],
    };
  }
}
