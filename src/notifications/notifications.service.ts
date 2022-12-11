import { Inject, Injectable } from '@nestjs/common';
import { PubSubEngine } from 'graphql-subscriptions';
import { PinoLogger } from 'nestjs-pino';
import { v4 as uuid } from 'uuid';
import { Notification } from '../graphql';
import { PUB_SUB } from '../infra/redis-pubsub/redis-pubsub.module';
import { CreateNotificationInput } from './dto/create-notification.input';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly logger: PinoLogger,
    @Inject(PUB_SUB) private readonly pubSub: PubSubEngine,
  ) {
    this.logger.setContext(NotificationsService.name);
  }

  create(createNotificationInput: CreateNotificationInput) {
    this.logger.info('Creating notification...');

    const payload: Notification = {
      ...createNotificationInput,
      id: uuid(),
      createdAt: new Date().toISOString(),
    };

    /**
     * Send an event to `asynIterator` respond on WebSocket.
     * Use the same "topic" name!
     */
    this.pubSub.publish('notificationCreated', payload);

    return payload;
  }
}
