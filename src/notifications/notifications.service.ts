import { InjectQueue } from '@nestjs/bull';
import { Inject, Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { PubSubEngine } from 'graphql-subscriptions';
import { PinoLogger } from 'nestjs-pino';
import { v4 as uuid } from 'uuid';
import { Notification } from '../graphql';
import { RedisCacheService } from '../infra/redis-cache/redis-cache.service';
import { PUB_SUB } from '../infra/redis-pubsub/redis-pubsub.module';
import { millisecondsToSeconds } from '../shared/utils/ms/ms.util';
import { CreateNotificationInput } from './dto/create-notification.input';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly logger: PinoLogger,
    @Inject(PUB_SUB) private readonly pubSub: PubSubEngine,
    @InjectQueue('notifications-queue') private readonly queue: Queue,
    private readonly cacheService: RedisCacheService,
  ) {
    this.logger.setContext(NotificationsService.name);
  }

  async findOne(id: string): Promise<Notification> {
    const notification: Notification = await this.cacheService.get(
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
     * @note if running with Docker compose, access Bull Board on http://localhost:4000 and see the job
     */
    this.logger.debug(`Dispatching async worker to send e-mail...`);
    await this.queue.add('notifications-queue', payload, {
      attempts: 2,
      removeOnComplete: false,
    });

    /**
     * Cache notification on Redis to be retrieved with Query
     */
    this.logger.debug(`Defining cache key to notification...`);
    await this.cacheService.set(
      `notification:${payload.id}`,
      payload,
      millisecondsToSeconds('1h'),
    );

    return payload;
  }
}
