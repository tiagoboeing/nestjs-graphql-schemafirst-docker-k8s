import { Module } from '@nestjs/common';
import { IntegrationService } from './integration.service';
import { IntegrationResolver } from './integration.resolver';
import { PubSub } from 'graphql-subscriptions';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
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
