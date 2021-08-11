import { Arg, Args, Mutation, Query, Resolver, Subscription } from "type-graphql";
import { PlayerResult } from "../schema/player";
import { Player } from "../play";
import { SearchResult } from "../schema/search";
import { pubSub, TOPICS } from "../pubsub";
import { API } from "@gym/ytm-api";
import ytdle from 'youtube-dl-exec'
import { existsSync, readFileSync, writeFileSync, writeSync } from "fs";

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
}
