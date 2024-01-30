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
import { context } from './context';
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
        context,
        definitions: {
          path: join(process.cwd(), 'src/graphql.ts'),
          outputAs: 'interface',
          emitTypenameField: true,
        },
        introspection: true,
        playground: configService.get<boolean>(environments.graphqlPlayground),
        subscriptions: {
          'graphql-ws': true,
          'subscriptions-transport-ws': true,
        },
        formatError: (error: any) => {
          const graphQLFormattedError = {
            code:
              error?.extensions?.originalError?.error ||
              error.extensions?.code ||
              error.name ||
              'INTERNAL_SERVER_ERROR',
            ...error,
            message:
              error.extensions?.exception?.response?.message || error.message,
            extensions: {
              ...error?.extensions,
              code: undefined,
              stacktrace: undefined,
            },
          };

          return graphQLFormattedError;
        },
      }),
    }),
    HealthModule,
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const customLogLevel = configService.get<string>(
          environments.log.level,
        );
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
