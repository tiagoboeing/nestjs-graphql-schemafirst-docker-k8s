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
  integrationInterval: 'INTEGRATION_INTERVAL',
  integrationLimit: 'INTEGRATION_LIMIT',
  services: {},
};

export const isProduction = process.env.NODE_ENV === 'production';
