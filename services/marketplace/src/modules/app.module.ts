import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { MarketplaceController } from "../rest/marketplace.controller";
import { MarketplaceResolver } from "../schema/marketplace.resolver";
import { MarketplaceService } from "../services/marketplace.service";
import { MetricsController } from "../rest/metrics.controller";

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      path: "/graphql"
    })
  ],
  controllers: [MarketplaceController, MetricsController],
  providers: [MarketplaceResolver, MarketplaceService],
})
export class AppModule {}