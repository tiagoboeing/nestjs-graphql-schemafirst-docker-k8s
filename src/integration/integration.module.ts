import { Module } from '@nestjs/common';
import { IntegrationService } from './integration.service';
import { IntegrationResolver } from './integration.resolver';
import { HttpModule } from '@nestjs/axios';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis, { RedisOptions } from 'ioredis';

@Module({
  imports: [HttpModule],
  providers: [
    IntegrationResolver,
    IntegrationService,
    {
      provide: 'PUB_SUB',
      useFactory: () => {
        const options: RedisOptions = {
          host: 'redis-cluster.redis.svc.cluster.local',
          port: 6379,
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
