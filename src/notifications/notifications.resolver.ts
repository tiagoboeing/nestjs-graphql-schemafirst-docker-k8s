import { Inject } from '@nestjs/common';
import { Args, Mutation, Resolver, Subscription } from '@nestjs/graphql';
import { PubSubEngine } from 'graphql-subscriptions';
import { PUB_SUB } from '../infra/redis-pubsub/redis-pubsub.module';
import { CreateNotificationInput } from './dto/create-notification.input';
import { NotificationsService } from './notifications.service';

@Resolver('Notification')
export class NotificationsResolver {
  constructor(
    @Inject(PUB_SUB) private readonly pubSub: PubSubEngine,
    private readonly notificationsService: NotificationsService,
  ) {}

  @Mutation('createNotification')
  create(
    @Args('createNotificationInput')
    createNotificationInput: CreateNotificationInput,
  ) {
    return this.notificationsService.create(createNotificationInput);
  }

  @Subscription('notificationCreated', {
    resolve: (payload) => payload,
    filter: (payload, variables) => payload.topic === variables.topic,
  })
  async notificationCreated() {
    /**
     * You can receive the input using `@Args('topic') topic: string` as method param
     */
    return this.pubSub.asyncIterator('notificationCreated');
  }
}
