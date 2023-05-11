import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { AppModule } from './app.module';
import fs from 'fs';
import { isProduction, useSSL } from './@core/environments';

const httpsOptions = {
  cert: fs.readFileSync('./certificates/cert.pem'),
  key: fs.readFileSync('./certificates/key.pem'),
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    httpsOptions: useSSL && !isProduction ? httpsOptions : undefined,
    cors: {
      origin: '*',
    },
  });

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.SERVER_PORT || 3000, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);

  app.useLogger(app.get(Logger));
  app.flushLogs();
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
}
bootstrap();
