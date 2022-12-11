import { InjectQueue } from '@nestjs/bull';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { Cache } from 'cache-manager';
import { PubSubEngine } from 'graphql-subscriptions';
import ms from 'ms';
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
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @InjectQueue('notifications-queue')
    private readonly queue: Queue,
  ) {
    this.logger.setContext(NotificationsService.name);
  }

  async findOne(id: string): Promise<Notification> {
    const notification: Notification = await this.cacheManager.get(
      `notification:${id}`,
    );

    if (!notification) {
      this.logger.warn(`Notification ${id} not found on cache!`);
    }

    return notification;
  }

  async create(
    createNotificationInput: CreateNotificationInput,
  ): Promise<Notification> {
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
    this.logger.debug(`Dispatching async worker to send e-mail...`);
    await this.queue.add('notifications-queue', payload, {
      attempts: 2,
      removeOnComplete: true,
    });

    /**
     * Cache notification on Redis to be retrieved with Query
     */
    this.logger.debug(`Defining cache key to notification...`);
    await this.cacheManager.set(
      `notification:${payload.id}`,
      payload,
      ms('1h'),
    );

    return payload;
  }
}
