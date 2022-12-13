import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache, Store } from 'cache-manager';
import environments from '../../@core/environments';
import { name as appName } from '../../../package.json';

@Injectable()
export class RedisCacheService implements Cache<Store> {
  private readonly cachePrefix: string;

  store: Store;

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly config: ConfigService,
  ) {
    this.cachePrefix = this.config.get(environments.redis.prefix) || appName;
  }

  private getKeyWithPrefix(key: string) {
    return `${this.cachePrefix}:cache:${key}`;
  }

  get<T>(key: string): Promise<T> {
    const keyWithPrefix = this.getKeyWithPrefix(key);
    return this.cacheManager.get(keyWithPrefix);
  }

  set(key: string, value: unknown, ttl?: number): Promise<void> {
    const keyWithPrefix = this.getKeyWithPrefix(key);
    return this.cacheManager.set(keyWithPrefix, value, ttl);
  }

  del(key: string): Promise<void> {
    const keyWithPrefix = this.getKeyWithPrefix(key);
    return this.cacheManager.del(keyWithPrefix);
  }

  reset(): Promise<void> {
    return this.cacheManager.reset();
  }

  wrap<T>(key: string, fn: () => Promise<T>, ttl?: number): Promise<T> {
    const keyWithPrefix = this.getKeyWithPrefix(key);
    return this.cacheManager.wrap(keyWithPrefix, fn, ttl);
  }
}
