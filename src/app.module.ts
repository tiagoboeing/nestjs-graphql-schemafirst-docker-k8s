import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import {
  resolvers as scalarResolvers,
  typeDefs as scalarTypeDefs,
} from 'graphql-scalars';
import { LoggerModule } from 'nestjs-pino';
import { join } from 'path';
import environments, { isProduction } from './@core/environments';
import { HealthModule } from './@core/health/health.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisQueueModule } from './infra/redis-queue/redis-queue.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    RedisQueueModule.forRoot(),
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        typePaths: ['./**/*.graphql'],
        typeDefs: [...scalarTypeDefs],
        resolvers: [scalarResolvers],
        definitions: {
          path: join(process.cwd(), 'src/graphql.ts'),
          outputAs: 'interface',
          emitTypenameField: true,
        },
        introspection: true,
        playground: configService.get<boolean>('GRAPHQL_PLAYGROUND'),
        subscriptions: {
          'graphql-ws': true,
          'subscriptions-transport-ws': true,
        },
      }),
    }),
    HealthModule,
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const customLogLevel = configService.get<string>(environments.logLevel);
        const productionLogLevel = !isProduction ? 'trace' : 'info';

        return {
          pinoHttp: {
            level: customLogLevel || productionLogLevel,
            timestamp: () => `,"time":"${new Date().toISOString()}"`,
            transport: !isProduction
              ? {
                  target: 'pino-pretty',
                  options: {
                    singleLine: true,
                  },
                }
              : undefined,
          },
        };
      },
    }),
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
