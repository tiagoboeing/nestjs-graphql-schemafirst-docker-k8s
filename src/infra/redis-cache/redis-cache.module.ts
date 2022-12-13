import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import ms from 'ms';
import environments from '../../@core/environments';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          store: redisStore,
          host: config.get(environments.redis.host),
          port: +config.get(environments.redis.port) || 6379,
          ttl: +config.get(environments.cache.ttl) || ms('10m'),
        };
      },
    }),
  ],
  providers: [ConfigService],
  exports: [CacheModule],
})
export class RedisCacheModule {}
