import { Arg, Args, Mutation, Query, Resolver, Subscription } from "type-graphql";
import { PlayerResult } from "../schema/player";
import { Player } from "../play";
import { SearchResult } from "../schema/search";
import { pubSub, TOPICS } from "../pubsub";

@Resolver(PlayerResult)
export class PlayerResolver {
  @Query(returns => PlayerResult)
  player(): PlayerResult {
    return Player
  }

  @Mutation(returns => PlayerResult)
  play(@Args(type => SearchResult) song: SearchResult): PlayerResult {
    Player.add(song)

    return Player
  }

  @Subscription({
    topics: [TOPICS.CURRENT_SONG, TOPICS.QUEUE],
  })
  onPlayerUpdated(): PlayerResult {
    return Player
  }
}
