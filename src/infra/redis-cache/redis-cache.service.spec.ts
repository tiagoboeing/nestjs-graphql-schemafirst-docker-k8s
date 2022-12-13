import { createMock } from '@golevelup/ts-jest';
import { CACHE_MANAGER } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Cache } from 'cache-manager';
import { name as appName } from '../../../package.json';
import { RedisCacheService } from './redis-cache.service';

const FAKE_REDIS_PREFIX = 'env-prefix';

describe('RedisCacheService', () => {
  let service: RedisCacheService;
  const mockConfigServiceGet = jest.fn();
  const mockCacheManagerGet = jest.fn();
  const mockCacheManagerSet = jest.fn();
  const mockCacheManagerReset = jest.fn();
  const mockCacheManagerDel = jest.fn();
  const mockCacheManagerWrap = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        RedisCacheService,
        {
          provide: CACHE_MANAGER,
          useValue: createMock<Cache>({
            get: mockCacheManagerGet,
            set: mockCacheManagerSet,
            reset: mockCacheManagerReset,
            del: mockCacheManagerDel,
            wrap: mockCacheManagerWrap,
          }),
        },
        {
          provide: ConfigService,
          useValue: {
            get: mockConfigServiceGet,
          },
        },
      ],
    }).compile();

    service = module.get<RedisCacheService>(RedisCacheService);
  });

  afterEach(() => jest.restoreAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getKeyWithPrefix()', () => {
    describe('When using .env file', () => {
      beforeAll(() => {
        mockConfigServiceGet.mockReturnValue(FAKE_REDIS_PREFIX);
      });

      it('should correct key prefix from .env', () => {
        const key = 'test';
        const result = service['getKeyWithPrefix'](key);

        expect(mockConfigServiceGet).toHaveBeenCalled();
        expect(result).toMatch(`${FAKE_REDIS_PREFIX}:cache:${key}`);
      });
    });

    describe('When using fallback value', () => {
      beforeAll(() => {
        mockConfigServiceGet.mockReturnValue(null);
      });

      it('should use fallback prefix', () => {
        const key = 'test';
        const result = service['getKeyWithPrefix'](key);

        expect(mockConfigServiceGet).toHaveBeenCalled();
        expect(result).toMatch(`${appName}:cache:${key}`);
      });
    });
  });

  describe('get()', () => {
    beforeAll(() => {
      // mock prefix
      mockConfigServiceGet.mockReturnValue(FAKE_REDIS_PREFIX);
    });

    afterEach(jest.resetAllMocks);

    it('should call Cache Manager with correct params', () => {
      mockCacheManagerGet.mockResolvedValue(null);

      service.get<string>('test');

      expect(mockCacheManagerGet).toHaveBeenCalledWith(
        `${FAKE_REDIS_PREFIX}:cache:test`,
      );
    });

    it('should correct return value', () => {
      mockCacheManagerGet.mockResolvedValue('value');

      const result = service.get('test');

      expect(mockCacheManagerGet).toHaveBeenCalledTimes(1);
      expect(result).resolves.toEqual('value');
    });

    it('should not return value if not exists', () => {
      mockCacheManagerGet.mockResolvedValue(null);

      const result = service.get<string>('test');

      expect(mockCacheManagerGet).toHaveBeenCalledTimes(1);
      expect(result).resolves.toBeNull();
    });
  });

  describe('set()', () => {
    beforeAll(() => {
      // mock prefix
      mockConfigServiceGet.mockReturnValue(FAKE_REDIS_PREFIX);
    });

    it('should set value to cache', () => {
      const result = service.set('my-key', 'value');

      expect(mockCacheManagerSet).toHaveBeenCalledWith(
        `${FAKE_REDIS_PREFIX}:cache:my-key`,
        'value',
        undefined,
      );

      expect(result).toEqual(undefined);
    });

    it('should set value to cache with TTL', () => {
      const result = service.set('my-key', 'value', 60);

      expect(mockCacheManagerSet).toHaveBeenCalledWith(
        `${FAKE_REDIS_PREFIX}:cache:my-key`,
        'value',
        60,
      );

      expect(result).toEqual(undefined);
    });
  });

  describe('del()', () => {
    beforeAll(() => {
      // mock prefix
      mockConfigServiceGet.mockReturnValue(FAKE_REDIS_PREFIX);
    });

    it('should correct call Cache Manager', () => {
      const result = service.del('my-key');

      expect(mockCacheManagerDel).toHaveBeenCalledWith(
        `${FAKE_REDIS_PREFIX}:cache:my-key`,
      );

      expect(result).toEqual(undefined);
    });
  });

  describe('wrap()', () => {
    beforeEach(() => {
      // mock prefix
      mockConfigServiceGet.mockReturnValue(FAKE_REDIS_PREFIX);
    });

    it('should correct call Cache Manager', () => {
      const spyFn = jest.fn();
      const result = service.wrap('my-key', spyFn);

      expect(mockCacheManagerWrap).toHaveBeenCalledWith(
        `${FAKE_REDIS_PREFIX}:cache:my-key`,
        spyFn,
        undefined,
      );

      expect(result).toEqual(undefined);
    });

    it('should correct call Cache Manager with ttl', () => {
      const spyFn = jest.fn();
      const result = service.wrap('my-key', spyFn, 60);

      expect(mockCacheManagerWrap).toHaveBeenCalledWith(
        `${FAKE_REDIS_PREFIX}:cache:my-key`,
        spyFn,
        60,
      );

      expect(result).toEqual(undefined);
    });
  });

  describe('reset()', () => {
    beforeEach(() => {
      // mock prefix
      mockConfigServiceGet.mockReturnValue(FAKE_REDIS_PREFIX);
    });

    it('should correct call Cache Manager', () => {
      const result = service.reset();

      expect(mockCacheManagerReset).toHaveBeenCalledWith();
      expect(result).toEqual(undefined);
    });
  });
});
