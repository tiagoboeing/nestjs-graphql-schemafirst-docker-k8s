import { Inject, Injectable, Logger, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PubSubEngine } from 'graphql-subscriptions';
import { CreateIntegrationInput } from './dto/create-integration.input';
import { IntegrationWorker } from './integration.worker';

@Injectable({ scope: Scope.REQUEST })
export class IntegrationService {
  private readonly logger = new Logger(IntegrationService.name);

  constructor(
    private readonly configService: ConfigService,
    @Inject('PUB_SUB') private pubSub: PubSubEngine,
  ) {}

  async create(
    createIntegrationInput: CreateIntegrationInput,
  ): Promise<boolean> {
    await this.createSTD(createIntegrationInput.id);
    new IntegrationWorker(
      createIntegrationInput.id,
      this.configService,
      this.pubSub,
    ).doWork();
    return true;
  }

  async createSTD(id: string) {
    this.logger.log(`Created for ${id}`);
    return null;
  }
}
