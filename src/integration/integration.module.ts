import { Module } from '@nestjs/common';
import { IntegrationService } from './integration.service';
import { IntegrationResolver } from './integration.resolver';
import { PubSub } from 'graphql-subscriptions';

@Module({
  providers: [
    IntegrationResolver,
    IntegrationService,
    {
      provide: 'PUB_SUB',
      useValue: new PubSub(),
    },
  ],
})
export class IntegrationModule {}
