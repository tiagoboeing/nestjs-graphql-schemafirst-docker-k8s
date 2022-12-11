import { Inject, Injectable } from '@nestjs/common';
import { PubSubEngine } from 'graphql-subscriptions';
import { PinoLogger } from 'nestjs-pino';
import { v4 as uuid } from 'uuid';
import { Notification } from '../graphql';
import { PUB_SUB } from '../infra/redis-pubsub/redis-pubsub.module';
import { CreateNotificationInput } from './dto/create-notification.input';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly logger: PinoLogger,
    @Inject(PUB_SUB) private readonly pubSub: PubSubEngine,
    @InjectQueue('notifications-queue')
    private readonly queue: Queue,
  ) {
    this.logger.setContext(NotificationsService.name);
  }

  async create(createNotificationInput: CreateNotificationInput) {
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
    await this.pubSub.publish('notificationCreated', payload);

    /**
     * Dispatch a worker to execute async process, like e-mail sending
     */
    await this.queue.add('notifications-queue', payload, {
      attempts: 2,
      removeOnComplete: true,
    });

    return payload;
  }
}
