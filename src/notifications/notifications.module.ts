import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsResolver } from './notifications.resolver';
import { RedisPubSubModule } from '../infra/redis-pubsub/redis-pubsub.module';
import { RedisQueueModule } from '../infra/redis-queue/redis-queue.module';
import { NotificationsWorker } from './workers/notifications.worker';

@Module({
  imports: [RedisPubSubModule, RedisQueueModule],
  providers: [NotificationsResolver, NotificationsService, NotificationsWorker],
})
export class NotificationsModule {}
