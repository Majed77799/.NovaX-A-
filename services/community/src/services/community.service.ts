import { Injectable } from "@nestjs/common";

@Injectable()
export class CommunityService {
  private readonly likes: Map<string, Set<string>> = new Map();

  like(postId: string, userId: string) {
    const set = this.likes.get(postId) || new Set<string>();
    set.add(userId);
    this.likes.set(postId, set);
    return { postId, likes: set.size };
  }
}