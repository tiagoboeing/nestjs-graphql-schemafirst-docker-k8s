import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PubSubEngine } from 'graphql-subscriptions';
import { setInterval } from 'timers';
import { CreateIntegrationInput } from './dto/create-integration.input';

@Injectable()
export class IntegrationService {
  interval = null;
  iterations = 0;
  private readonly logger = new Logger(IntegrationService.name);
  private readonly apiBaseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject('PUB_SUB') private pubSub: PubSubEngine,
  ) {
    this.apiBaseUrl = this.configService.get('SERVICE_LOGISTICA_REVERSA');
  }

  async create(
    createIntegrationInput: CreateIntegrationInput,
  ): Promise<boolean> {
    this.logger.log(this.apiBaseUrl);

    await this.createSTD(createIntegrationInput.id);

    this.interval = setInterval(async () => {
      if (this.iterations >= 5) {
        this.iterations = 0;

        this.logger.log(
          `Integration finished for id ${createIntegrationInput.id}`,
        );

        return clearInterval(this.interval);
      }

      this.logger.log(
        `Creating integration for id ${createIntegrationInput.id}...`,
      );

      // const apiResponse = await this.httpService
      //   .get<any>(`${this.apiBaseUrl}/api/consultarstd`)
      //   .pipe(
      //     map((response) => {
      //       return response.data;
      //     }),
      //     catchError((error) => {
      //       this.logger.log(error.response.data);
      //       throw error;
      //     }),
      //   )
      //   .toPromise();

      const apiResponse = {
        data: [
          {
            etapa: '1',
          },
          {
            etapa: '2',
          },
        ],
      };

      if (apiResponse) {
        const steps = apiResponse.data.map((step) => ({ step: step.etapa }));

        this.logger.log(steps);

        await this.pubSub.publish('integration', {
          id: createIntegrationInput.id,
          steps,
        });
      }

      this.iterations++;
      this.logger.log(this.iterations);
    }, 5000);

    return true;
  }

  async createSTD(id: string) {
    this.logger.log(`Created STD for ${id}`);
    return null;
  }
}
