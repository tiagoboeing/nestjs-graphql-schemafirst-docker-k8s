export default {
  redis: {
    host: 'REDIS_HOST',
    port: 'REDIS_PORT',
    username: 'REDIS_USERNAME',
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
