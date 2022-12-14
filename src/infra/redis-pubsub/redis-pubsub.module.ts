import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis, { RedisOptions } from 'ioredis';
import environments from '../../@core/environments';
import { name as appName } from '../../../package.json';

export const PUB_SUB = 'PUB_SUB';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: PUB_SUB,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const options: RedisOptions = {
          host: config.get(environments.redis.host),
          port: +config.get(environments.redis.port) || 6379,
          username: config.get(environments.redis.username),
          showFriendlyErrorStack: true,
          commandTimeout: +config.get(environments.pubsub.timeout) || 3000,
          keyPrefix: config.get(environments.redis.prefix) || appName,
        };

        return new RedisPubSub({
          publisher: new Redis(options),
          subscriber: new Redis(options),
        });
      },
    },
  ],
  exports: [PUB_SUB],
})
export class RedisPubSubModule {}
