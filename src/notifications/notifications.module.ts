import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsResolver } from './notifications.resolver';
import { RedisPubSubModule } from '../infra/redis-pubsub/redis-pubsub.module';

@Module({
  imports: [RedisPubSubModule],
  providers: [NotificationsResolver, NotificationsService],
})
export class NotificationsModule {}
