import { Inject, Injectable, Logger, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PubSubEngine } from 'graphql-subscriptions';
import { PinoLogger } from 'nestjs-pino';
import { CreateIntegrationInput } from './dto/create-integration.input';
import { IntegrationWorker } from './integration.worker';

@Injectable({ scope: Scope.REQUEST })
export class IntegrationService {
  constructor(
    private readonly configService: ConfigService,
    @Inject('PUB_SUB') private pubSub: PubSubEngine,
    private readonly logger: PinoLogger,
  ) {}

  async create(
    createIntegrationInput: CreateIntegrationInput,
  ): Promise<boolean> {
    await this.createSTD(createIntegrationInput.id);
    new IntegrationWorker(
      createIntegrationInput.id,
      this.configService,
      this.pubSub,
      this.logger,
    ).doWork();
    return true;
  }

  async createSTD(id: string) {
    this.logger.info(`Created for ${id}`);
    return null;
  }
}
