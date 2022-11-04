import { Inject } from '@nestjs/common';
import { Args, Mutation, Resolver, Subscription } from '@nestjs/graphql';
import { PubSubEngine } from 'graphql-subscriptions';
import { CreateIntegrationInput } from './dto/create-integration.input';
import { IntegrationService } from './integration.service';

@Resolver('Integration')
export class IntegrationResolver {
  constructor(
    private readonly integrationService: IntegrationService,
    @Inject('PUB_SUB') private pubSub: PubSubEngine,
  ) {}

  @Mutation('createIntegration')
  async create(
    @Args('createIntegrationInput')
    createIntegrationInput: CreateIntegrationInput,
  ) {
    const payload = await this.integrationService.create(
      createIntegrationInput,
    );

    return payload;
  }

  @Subscription('integrationCreated', {
    resolve: (payload) => payload.steps,
    filter: (payload, variables) => payload.id === variables.id,
  })
  integrationCreated() {
    return this.pubSub.asyncIterator('integration');
  }
}
