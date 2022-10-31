import { Module } from "@nestjs/common";
import { IntegrationService } from "./integration.service";
import { IntegrationResolver } from "./integration.resolver";
import { HttpModule } from "@nestjs/axios";
import { RedisPubSub } from "graphql-redis-subscriptions";

@Module({
  imports: [HttpModule],
  providers: [
    IntegrationResolver,
    IntegrationService,
    {
      provide: "PUB_SUB",
      useValue: new RedisPubSub()
    }
  ]
})
export class IntegrationModule {
}
