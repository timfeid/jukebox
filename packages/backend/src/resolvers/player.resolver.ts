import { Arg, Args, Mutation, Query, Resolver, Subscription } from "type-graphql";
import { PlayerResult } from "../schema/player";
import { Player } from "../play";
import { SearchResult } from "../schema/search";
import { pubSub, TOPICS } from "../pubsub";
import { API } from "@gym/ytm-api";

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

  @Mutation(returns => PlayerResult)
  async continuousPlay(
    @Arg('continousPlay', type => Boolean) continuousPlay: boolean,
    @Arg('playlistId', type => String, { nullable: true }) browseId: string,
  ) {
    if (continuousPlay && !browseId) {
      throw new Error("Playlist ID must be provided when playing continous music")
    }

    if (continuousPlay) {
      Player.startContinuousPlay(await API.browse(browseId))
    } else {
      Player.stopContinousPlay()
    }

    return Player
  }

  @Subscription({
    topics: [TOPICS.CURRENT_SONG, TOPICS.QUEUE],
  })
  onPlayerUpdated(): PlayerResult {
    return Player
  }
}
