import { ConfigService } from '@nestjs/config';
import { PubSubEngine } from 'graphql-subscriptions';
import { PinoLogger } from 'nestjs-pino';

export class IntegrationWorker {
  private readonly integrationInterval: number;
  private readonly integrationLimit: number;

  constructor(
    private readonly id: string,
    private readonly configService: ConfigService,
    private pubSub: PubSubEngine,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(IntegrationWorker.name);

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

        this.logger.info(`Integration finished for id ${this.id}`);

        return clearInterval(this.interval);
      }

      this.logger.info(`Creating integration for id ${this.id}...`);

      this.apiResponse.data.push({
        etapa: `${this.iterations + 1}`,
      });

      if (this.apiResponse.data) {
        const steps = this.apiResponse.data.map((step) => ({
          step: step.etapa,
          id: this.id,
        }));

        this.logger.trace(steps);

        await this.pubSub.publish('integration', {
          id: this.id,
          steps,
        });
      }

      this.iterations++;
      this.apiResponse.data = [];

      this.logger.info(this.iterations);
    }, this.integrationInterval);
  }
}
