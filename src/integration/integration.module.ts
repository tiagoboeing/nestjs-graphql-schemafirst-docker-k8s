import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis, { RedisOptions } from 'ioredis';
import { IntegrationResolver } from './integration.resolver';
import { IntegrationService } from './integration.service';

@Module({
  imports: [HttpModule],
  providers: [
    IntegrationResolver,
    IntegrationService,
    {
      provide: 'PUB_SUB',
      useFactory: () => {
        const options: RedisOptions = {
          host: 'redis.redis.svc.cluster.local',
          port: 6379,
          username: 'default',
          autoResubscribe: true,
          showFriendlyErrorStack: true,
        };

        return new RedisPubSub({
          publisher: new Redis(options),
          subscriber: new Redis(options),
        });
      },
    },
  ],
})
export class IntegrationModule {}
