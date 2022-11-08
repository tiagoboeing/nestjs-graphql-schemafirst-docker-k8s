import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PubSubEngine } from 'graphql-subscriptions';
import { setInterval } from 'timers';
import { CreateIntegrationInput } from './dto/create-integration.input';

@Injectable()
export class IntegrationService {
  private readonly logger = new Logger(IntegrationService.name);
  private readonly integrationInterval: number;
  private readonly integrationLimit: number;

  interval = null;
  iterations = 0;
  apiResponse = { data: [] };

  constructor(
    private readonly configService: ConfigService,
    @Inject('PUB_SUB') private pubSub: PubSubEngine,
  ) {
    this.integrationInterval = this.configService.get('INTEGRATION_INTERVAL');
    this.integrationLimit = this.configService.get('INTEGRATION_LIMIT');
  }

  async create(
    createIntegrationInput: CreateIntegrationInput,
  ): Promise<boolean> {
    await this.createSTD(createIntegrationInput.id);

    this.interval = setInterval(async () => {
      if (this.iterations >= this.integrationLimit) {
        this.iterations = 0;

        this.logger.log(
          `Integration finished for id ${createIntegrationInput.id}`,
        );

        return clearInterval(this.interval);
      }

      this.logger.log(
        `Creating integration for id ${createIntegrationInput.id}...`,
      );

      this.apiResponse.data.push({
        etapa: `${this.iterations + 1}`,
      });

      if (this.apiResponse.data) {
        const steps = this.apiResponse.data.map((step) => ({
          step: step.etapa,
        }));

        this.logger.log(steps);

        await this.pubSub.publish('integration', {
          id: createIntegrationInput.id,
          steps,
        });
      }

      this.iterations++;
      this.apiResponse.data = [];

      this.logger.log(this.iterations);
    }, this.integrationInterval);

    return true;
  }

  async createSTD(id: string) {
    this.logger.log(`Created STD for ${id}`);
    return null;
  }
}
