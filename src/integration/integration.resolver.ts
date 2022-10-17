import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { CreateIntegrationInput } from './dto/create-integration.input';
import { UpdateIntegrationInput } from './dto/update-integration.input';
import { IntegrationService } from './integration.service';

@Resolver('Integration')
export class IntegrationResolver {
  constructor(
    private readonly integrationService: IntegrationService,
    @Inject('PUB_SUB') private pubSub: PubSub,
  ) {}

  @Mutation('createIntegration')
  async create(
    @Args('createIntegrationInput')
    createIntegrationInput: CreateIntegrationInput,
  ) {
    await this.pubSub.publish('integrationCreated', {
      sat: '123',
      std: '123',
      status: '1 - Ok',
    });

    return this.integrationService.create(createIntegrationInput);
  }

  @Query('integrations')
  findAll() {
    return this.integrationService.findAll();
  }

  @Query('integration')
  findOne(@Args('id') id: number) {
    return this.integrationService.findOne(id);
  }

  @Mutation('updateIntegration')
  update(
    @Args('updateIntegrationInput')
    updateIntegrationInput: UpdateIntegrationInput,
  ) {
    return this.integrationService.update(
      updateIntegrationInput.id,
      updateIntegrationInput,
    );
  }

  @Mutation('removeIntegration')
  remove(@Args('id') id: number) {
    return this.integrationService.remove(id);
  }

  @Subscription('integrationCreated')
  publishCreated() {
    return this.pubSub.asyncIterator('integrationCreated');
  }
}
