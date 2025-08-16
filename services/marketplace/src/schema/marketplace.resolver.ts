import { Resolver, Query, Mutation, Args, ObjectType, Field, Float } from "@nestjs/graphql";
import { MarketplaceService } from "../services/marketplace.service";

@ObjectType()
class Listing {
  @Field() id!: string;
  @Field() title!: string;
  @Field(() => Float) price!: number;
}

@Resolver(() => Listing)
export class MarketplaceResolver {
  constructor(private readonly service: MarketplaceService) {}

  @Query(() => [Listing])
  listings() {
    return this.service.listings();
  }

  @Mutation(() => Listing)
  createListing(
    @Args("title") title: string,
    @Args("price") price: number
  ) {
    return this.service.createListing({ title, price });
  }
}