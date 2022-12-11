import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PubSubEngine } from 'graphql-subscriptions';

export class IntegrationWorker {
  private readonly logger = new Logger(IntegrationWorker.name);
  private readonly integrationInterval: number;
  private readonly integrationLimit: number;

  constructor(
    private readonly id: string,
    private readonly configService: ConfigService,
    private pubSub: PubSubEngine,
  ) {
    this.integrationInterval = this.configService.get('INTEGRATION_INTERVAL');
    this.integrationLimit = this.configService.get('INTEGRATION_LIMIT');
  }

  interval = null;
  iterations = 0;
  apiResponse = { data: [] };

  doWork() {
    this.interval = setInterval(async () => {
      if (this.iterations >= this.integrationLimit) {
        this.iterations = 0;

        this.logger.log(`Integration finished for id ${this.id}`);

        return clearInterval(this.interval);
      }

      this.logger.log(`Creating integration for id ${this.id}...`);

      this.apiResponse.data.push({
        etapa: `${this.iterations + 1}`,
      });

      if (this.apiResponse.data) {
        const steps = this.apiResponse.data.map((step) => ({
          step: step.etapa,
          id: this.id,
        }));

        this.logger.log(steps);

        await this.pubSub.publish('integration', {
          id: this.id,
          steps,
        });
      }

      this.iterations++;
      this.apiResponse.data = [];

      this.logger.log(this.iterations);
    }, this.integrationInterval);
  }
}
