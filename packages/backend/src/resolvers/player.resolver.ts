import { Arg, Args, Ctx, Field, Mutation, ObjectType, Query, Resolver, Root, Subscription } from "type-graphql";
import { PlayerResult } from "../schema/player";
import { Player } from "../play";
import { SearchResult } from "../schema/search";
import { pubSub, TOPICS } from "../pubsub";
import { API } from "@gym/ytm-api";
import ytdle from 'youtube-dl-exec'
import { existsSync, readFileSync, writeFileSync, writeSync } from "fs";
import Container, { Service } from "typedi";
import { UserService } from "../services/user.service";

@ObjectType()
class Broadcast {
  @Field()
  message: string

  @Field()
  type: string

}

@Service()
@Resolver(PlayerResult)
export class PlayerResolver {
  constructor(private readonly userService = Container.get(UserService)) {}

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
    @Arg('continuousPlay', type => Boolean) continuousPlay: boolean,
    @Arg('playlistId', type => String, { nullable: true }) browseId: string,
    @Arg('videos', type => Boolean, { nullable: true }) videos: boolean,
  ) {
    if (continuousPlay && !browseId) {
      throw new Error("Playlist ID must be provided when playing continous music")
    }

    if (continuousPlay) {
      if (videos) {
        try {
          console.log('grabbing it.  . . . .')
          const filename = `/tmp/${browseId}.json`
          writeFileSync(`/tmp/test.json`,  'testing')
          let videos
          if (existsSync(filename)) {
            console.log('from json')
            videos = JSON.parse(readFileSync(filename).toString())
          } else {
            console.log('from youtube')
            videos = await ytdle(`https://www.youtube.com/playlist?list=${browseId}`, {
              'dump-single-json': true,
              'skip-download': true
            })
            writeFileSync(filename,  JSON.stringify(videos))
          }

          const songs: SearchResult[] = []
          // @ts-ignore
          videos.entries.map(video => {
            songs.push({
              title: video.title,
              artist: video.artist || video.channel,
              albumArt: video.thumbnail,
              album: video.album || '',
              youtubeId: video.id,
            })
          })
          console.log(songs)
          Player.startContinuousPlay(songs, true)
        } catch (e) {
          console.log(e)
        }
      } else {
        Player.startContinuousPlay(await API.browse(browseId))
      }
    } else {
      Player.stopContinousPlay()
    }

    return Player
  }

  @Mutation(returns => Boolean)
  async upvote(@Ctx() ctx, @Arg('songIndex') songIndex: number) {
    const user = await this.userService.getUser(ctx.ip)
    if (user) {
      const song = Player.upvote(songIndex, user.mac)
      if (song) {
        pubSub.publish(TOPICS.BROADCAST, {
          type: 'info',
          message: `${user.name} upvoted ${song.artist} - ${song.title}`,
        })
      }
    }

    return true
  }

  @Mutation(returns => Boolean)
  async downvote(@Ctx() ctx, @Arg('songIndex') songIndex: number) {
    const user = await this.userService.getUser(ctx.ip)
    if (user) {
      const song = Player.downvote(songIndex, user.mac)
      if (song) {
        pubSub.publish(TOPICS.BROADCAST, {
          type: 'info',
          message: `${user.name} downvoted ${song.artist} - ${song.title}`,
        })
      }
    }

    return true
  }

  @Mutation(returns => PlayerResult)
  async reset() {
    await Player.clearMediaPlayer()

    return Player
  }

  @Subscription({
    topics: [TOPICS.CURRENT_SONG, TOPICS.QUEUE],
  })
  onPlayerUpdated(): PlayerResult {
    return Player
  }

  @Subscription(() => Broadcast, {
    topics: [TOPICS.BROADCAST],
  })
  onBroadcast(
    @Root() payload: Broadcast,
  ): Broadcast {
    return payload
  }
}
