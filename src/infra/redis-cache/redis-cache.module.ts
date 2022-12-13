import {
  CacheModule,
  CacheModuleAsyncOptions,
  CacheStore,
  Module,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';
import ms from 'ms';
import environments from '../../@core/environments';
import { RedisCacheService } from './redis-cache.service';

@Module({
  imports: [
    CacheModule.registerAsync<CacheModuleAsyncOptions>({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const store = await redisStore({
          socket: {
            host: config.get(environments.redis.host),
            port: +config.get(environments.redis.port) || 6379,
          },
          username: config.get(environments.redis.username),
          password: config.get(environments.redis.password),
          ttl: +config.get(environments.cache.ttl) || ms('10m'),
        });

        /**
         * FIXME:
         * Will need the `as` cast because this issue:
         * https://github.com/dabroek/node-cache-manager-redis-store/issues/40
         */
        return {
          store,
        } as CacheModuleAsyncOptions;
      },
    }),
  ],
  providers: [ConfigService, RedisCacheService],
  exports: [CacheModule],
})
export class RedisCacheModule {}
