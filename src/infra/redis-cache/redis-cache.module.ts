import { CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';
import { CacheStore, Inject, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Store } from 'cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import type { RedisClientOptions } from 'redis';
import Redis from 'redis';
import environments from '../../@core/environments';
import { RedisCacheService } from './redis-cache.service';

interface RedisCache extends Cache {
  store: RedisStore;
}

interface RedisStore extends Store {
  name: 'redis';
  getClient: () => Redis.RedisClientType;
  isCacheableValue: (value: any) => boolean;
}

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

            reconnectStrategy: function (times) {
              const delay = Math.min(1000 + times * 50, 2000);
              return delay;
            },
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
export class RedisCacheModule implements OnModuleInit {
  constructor(
    @InjectPinoLogger(RedisCacheModule.name)
    private readonly logger: PinoLogger,
    @Inject(CACHE_MANAGER) private readonly cache: RedisCache,
  ) {}

  onModuleInit() {
    const client = this.cache.store.getClient();

    client.on('connect', () => this.logger.info('Redis client reconnected!'));
    client.on('ready', () => this.logger.debug('Redis client is ready'));
    client.on('end', () => this.logger.info('Redis client connection closed'));

    client.on('reconnecting', () =>
      this.logger.info('Redis client is reconnecting to server...'),
    );

    client.on('error', (error: Error) =>
      this.logger.error(`Redis connection failed! Error: "${error?.message}"`),
    );
  }
}
