import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import ms from 'ms';
import environments from '../../@core/environments';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          ttl: config.get(environments.cache.ttl) || ms('10m'),
          host: config.get(environments.redis.host),
          port: +config.get(environments.redis.port) || 6379,
        };
      },
    }),
  ],
  providers: [ConfigService],
  exports: [CacheModule],
})
export class RedisCacheModule {}
