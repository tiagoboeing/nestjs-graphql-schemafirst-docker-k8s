import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const options: RedisOptions = {
          host: config.get('REDIS_HOST'),
          port: config.get('REDIS_PORT') || 6379,
          username: config.get('REDIS_USERNAME'),
          showFriendlyErrorStack: true,
          commandTimeout: 3000,
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
