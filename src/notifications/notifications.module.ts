import { Module } from '@nestjs/common';
import { RedisCacheModule } from '../infra/redis-cache/redis-cache.module';
import { RedisPubSubModule } from '../infra/redis-pubsub/redis-pubsub.module';
import { RedisQueueModule } from '../infra/redis-queue/redis-queue.module';
import { NotificationsResolver } from './notifications.resolver';
import { NotificationsService } from './notifications.service';
import { NotificationsWorker } from './workers/notifications.worker';

@Module({
  imports: [RedisCacheModule, RedisPubSubModule, RedisQueueModule],
  providers: [NotificationsResolver, NotificationsService, NotificationsWorker],
})
export class NotificationsModule {}
