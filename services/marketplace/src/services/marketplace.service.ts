import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";

@Injectable()
export class MarketplaceService {
  private readonly listingsData: Array<{ id: string; title: string; price: number }> = [];

  listings() {
    return this.listingsData;
  }

  createListing(input: { title: string; price: number }) {
    const item = { id: randomUUID(), ...input };
    this.listingsData.push(item);
    return item;
  }
}