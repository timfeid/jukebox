import { PrismaClient } from ".prisma/client";
import { Arg, Args, Mutation, Query, Resolver, Subscription } from "type-graphql";
import { API } from "@gym/ytm-api";
import { PlayerResult } from "../schema/player";
import { Player } from "../play";
import { SearchResult } from "../schema/search";
import { pubSub } from "../pubsub";

export enum TOPICS {
  QUEUE = "QUEUE",
  CURRENT_SONG = "CURRENT_SONG",
}

Player.on('play', () => {
  pubSub.publish(TOPICS.CURRENT_SONG, Player)
})

@Resolver(PlayerResult)
export class PlayerResolver {
  @Query(returns => PlayerResult)
  player(): PlayerResult {
    return Player
  }

  @Mutation(returns => PlayerResult)
  play(@Args(type => SearchResult) song: SearchResult): PlayerResult {
    Player.add(song)
    pubSub.publish(TOPICS.QUEUE, this.player())

    return this.player()
  }

  @Subscription({
    topics: ["CURRENT_SONG", TOPICS.QUEUE],
  })
  onPlayerUpdated(): PlayerResult {
    return Player
  }
}
