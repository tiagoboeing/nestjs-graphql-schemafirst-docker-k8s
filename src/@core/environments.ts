export default {
  logLevel: 'LOG_LEVEL',
  redis: {
    host: 'REDIS_HOST',
    port: 'REDIS_PORT',
    username: 'REDIS_USERNAME',
    password: 'REDIS_PASSWORD',
    prefix: 'REDIS_PREFIX',
  },
  pubsub: {
    timeout: 'PUBSUB_TIMEOUT',
  },
  cache: {
    ttl: 'CACHE_TTL',
  },
  services: {},
};

export const isProduction = process.env.NODE_ENV === 'production';

export const useSSL = Boolean(process.env.LOCALHOST_HTTPS);
