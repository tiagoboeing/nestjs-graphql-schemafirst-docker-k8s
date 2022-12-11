import { OnQueueActive, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { PinoLogger } from 'nestjs-pino';
import { Notification } from '../../graphql';

@Processor('notifications-queue')
export class NotificationsWorker {
  constructor(private readonly logger: PinoLogger) {
    logger.setContext(NotificationsWorker.name);
  }

  @Process('notifications-queue')
  @OnQueueActive()
  async sendEmail(job: Job<Notification>) {
    const { id, topic, email } = job.data;

    this.logger.debug(
      `Starting email send to notification "${id}" - topic "${topic}"...`,
    );

    if (!email)
      return this.logger.warn(
        `Skipping... Notification "${id} without any email address!"`,
      );

    // wait 4 seconds until print message
    await new Promise((r) => setTimeout(r, 4000));

    this.logger.debug(`E-mail sent to notification "${id}"!`);
  }
}
