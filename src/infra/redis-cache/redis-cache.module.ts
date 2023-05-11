import { CacheModule } from '@nestjs/cache-manager';
import { CacheStore, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';
import type { RedisClientOptions } from 'redis';
import environments from '../../@core/environments';
import { RedisCacheService } from './redis-cache.service';

@Module({
  imports: [
    ConfigModule,
    CacheModule.registerAsync<RedisClientOptions>({
      imports: [ConfigModule],
      inject: [ConfigService],
      isGlobal: true,

      useFactory: async (config: ConfigService) => {
        /* FIXME:
         * Will need to use the `as` cast because this issue:
         * https://github.com/dabroek/node-cache-manager-redis-store/issues/40
         */
        const store = (await redisStore({
          socket: {
            host: config.get(environments.redis.host),
            port: +config.get(environments.redis.port) || 6379,
          },
          username: config.get(environments.redis.username),
          password: config.get(environments.redis.password),
        })) as unknown as CacheStore;

        return { store };
      },
    }),
  ],
  providers: [ConfigService, RedisCacheService],
  exports: [CacheModule, RedisCacheService],
})
export class RedisCacheModule {}
