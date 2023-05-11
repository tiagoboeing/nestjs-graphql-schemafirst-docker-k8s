import { Controller, Get } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectPinoLogger(AppController.name) private readonly logger: PinoLogger,
  ) {}

  @Get()
  getHello(): string {
    this.logger.info('Starting hello handler...');
    return this.appService.getHello();
  }
}
