import { SearchResult } from '@gym/ytm-api'
import dayjs from 'dayjs'
import EventEmitter from 'events'
import {
  subscribeEntities
} from "home-assistant-js-websocket"
import ytdl from 'ytdl-core'
import { HaConnection } from './homeassistant/connection'
import { prisma } from './prisma-client'
import { CurrentSong } from './schema/current-song'

const MEDIA_PLAYER_ENTITY_ID = process.env.MEDIA_PLAYER_ENTITY_ID
const VOTE_MAX = 2
type QueuedSong = SearchResult & { url?: string, upvotes: string[], downvotes: string[] }

type MediaPlayerEntity = {
  state: 'idle' | 'playing' | 'unknown'
  position: number
  positionUpdatedAt: dayjs.Dayjs
  duration: number
  url: string
}
export class PlayerClass extends EventEmitter {
  private _queue: QueuedSong[] = []
  private _currentSong: CurrentSong
  private mediaPlayerEntity: MediaPlayerEntity = {
    state: 'unknown',
    position: 0,
    positionUpdatedAt: dayjs(),
    duration: 0,
    url: '',
  }
  private connection: HaConnection
  private timeout: NodeJS.Timeout
  public isPlayingContinuously = false
  private continuousPlaylist: QueuedSong[] = []
  private grabbingNextUrl = false

  constructor () {
    super()

    this.connection = new HaConnection()
    this.connection.tryConnect().then(async () => {
      subscribeEntities(this.connection.connection, this.parseEntities)
      this.clearMediaPlayer()
      this.updateTimeLeft()
    })
  }

  updateTimeLeft = () => {
    this.timeout = setTimeout(this.updateTimeLeft, 1000)

    if (this.mediaPlayerEntity.state === 'playing' && this._currentSong && this._currentSong.url === this.mediaPlayerEntity.url) {
      this._currentSong.totalTime = this.mediaPlayerEntity.duration
      this._currentSong.timeElapsed = Math.round(this.mediaPlayerEntity.position + (dayjs().diff(this.mediaPlayerEntity.positionUpdatedAt, 's')))
      this.updated()
    }

    this.addUrlToNextSong()
  }

  parseEntities = (entities) => {
    const mpEentity = entities[MEDIA_PLAYER_ENTITY_ID]
    const state = mpEentity.state
    const position = mpEentity.attributes.media_position
    const positionUpdated = mpEentity.attributes.media_position_updated_at
    const url = mpEentity.attributes.media_content_id

    if (this._currentSong && this._currentSong.url === url) {
      if (state !== this.mediaPlayerEntity.state) {
        if (state === 'idle' && this.currentSong.receivedByPlayer) {
          console.log('Player is idle and we have received the song already, next song pls')
          this.nextSong(true)
        }

        if (state === 'playing' && !this._currentSong.receivedByPlayer) {
          console.log("We are playing the correct song! Mark it played & received.")
          this._currentSong.receivedByPlayer = true
          this.emit('playing')
        }
      }
    }

    this.mediaPlayerEntity = {
      state,
      position,
      positionUpdatedAt: dayjs(positionUpdated),
      duration: Math.round(mpEentity.attributes.media_duration),
      url,
    }
  }

  get currentSong () {
    return this._currentSong
  }

  get queue () {
    return this._queue
  }

  async play() {
    if (!this._currentSong.url) {
      let url = await this.getHighestAudioFromYoutubeId(this.currentSong.youtubeId)
      if (url !== false) {
        this._currentSong.url = url
      }
    }
    if (!this._currentSong.url) {
      console.log('something went wrong grabbing the url!')
      return this.nextSong(true)
    }
    const url = this._currentSong.url
    await this.connection.callService('media_player', 'play_media', {
      entity_id: MEDIA_PLAYER_ENTITY_ID,
      media_content_id: url,
      media_content_type: 'audio',
      extra: {
        metadata: {
          metadataType: 3,
          title: this._currentSong.title,
          artist: this._currentSong.artist,
          albumName: this._currentSong.album,
          images: [{url: this._currentSong.albumArt.replace(/w120-h120/, 'w400-h400')}],
        }
      },
    })
  }

  async getHighestAudioFromYoutubeId(youtubeId: string) {
    try {

      const info = await ytdl.getInfo(youtubeId)
      const format = ytdl.chooseFormat(info.formats, {
        // most reliable
        quality: 'highestaudio',
      })
      const url = format.url
      console.log('Retrieved audio from YT, playing to', MEDIA_PLAYER_ENTITY_ID, url)

      return url
    } catch (e) {
      console.log(e)
      console.log(':(')

    }
    return false
  }

  async addUrlToNextSong () {
    if (this.grabbingNextUrl) {
      return
    }
    this.grabbingNextUrl = true
    if (this.queue.length > 0 && this.queue[0].url === undefined) {
      console.log('grabbing next song')
      const url = await this.getHighestAudioFromYoutubeId(this.queue[0].youtubeId)
      this.queue[0].url = url || ''
    } else if (this.isPlayingContinuously && this.continuousPlaylist.length > 0 && this.continuousPlaylist[0].url === undefined) {
      console.log('grabbing next continuous song')
      const url = await this.getHighestAudioFromYoutubeId(this.continuousPlaylist[0].youtubeId)
      this.continuousPlaylist[0].url = url || ''
    }
    this.grabbingNextUrl = false
  }

  async clearMediaPlayer() {
    return await this.connection.callService('media_player', 'media_stop', {
      entity_id: MEDIA_PLAYER_ENTITY_ID,
    })
  }

  add(song: SearchResult) {
    this.queue.push({
      ...song,
      upvotes: [],
      downvotes: [],
    })
    this.emit('added-song')

    this.nextSong()
  }

  newCurrentSong(song: SearchResult) {
    const currentSong = new CurrentSong(song)
    currentSong.timeElapsed = 0
    currentSong.totalTime = 0

    return currentSong
  }

  nextSongIsCurrentSong() {
    return this.newCurrentSong(this.queue.shift())
  }

  nextSong (forceNext = false) {
    if (forceNext && this.queue.length === 0) {
      this._currentSong = null
    }

    if ((this.currentSong && !forceNext) || this.queue.length === 0) {
      if (forceNext) {
        if (this.queue.length === 0 && this.isPlayingContinuously && this.continuousPlaylist.length !== 0) {
          this._currentSong = this.newCurrentSong(this.continuousPlaylist.shift())
          return Player.play()
        } else {
          this.updated()
        }
      }
      return
    }

    try {
      this._currentSong = this.nextSongIsCurrentSong()
      if (this.currentSong) {
        console.log('hello')
        Player.play()
      }
    } catch (e) {
      console.log(e)
    }
  }

  stopContinousPlay() {
    this.isPlayingContinuously = false
  }

  startContinuousPlay(songs: SearchResult[], shuffle = true) {
    this.isPlayingContinuously = true

    if (shuffle) {
      for (var i = songs.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1))
        var temp = songs[i]
        songs[i] = songs[j]
        songs[j] = temp
      }
    }

    this.continuousPlaylist = songs.map(song => ({
      ...song,
      upvotes: [],
      downvotes: [],
    }))

    this.updated()
  }

  updated () {
    this.emit('updated')
  }

  upvote(queueIndex: number, mac: string) {
    const song = this._queue[queueIndex]
    if (song) {
      let returnSong = false
      const sneakyUpvoteIndex = song.downvotes.findIndex(id => id === mac)
      if (sneakyUpvoteIndex !== -1) {
        song.downvotes.splice(sneakyUpvoteIndex, 1)
      }
      const index = song.upvotes.findIndex(id => id === mac)
      if (index === -1) {
        returnSong = true
        song.upvotes.push(mac)
      } else {
        song.upvotes.splice(index)
      }

      if (song.upvotes.length > VOTE_MAX) {
        this._queue.splice(queueIndex, 1)
        this._queue.unshift(song)
      } else {
        this._queue[queueIndex] = song
      }

      if (returnSong) {
        return song
      }
    }
  }

  downvote(queueIndex: number, mac: string) {
    const song = this._queue[queueIndex]
    if (song) {
      let returnSong = false
      const sneakyUpvoteIndex = song.upvotes.findIndex(id => id === mac)
      if (sneakyUpvoteIndex !== -1) {
        song.upvotes.splice(sneakyUpvoteIndex, 1)
      }

      const index = song.downvotes.findIndex(id => id === mac)
      if (index === -1) {
        returnSong = true
        song.downvotes.push(mac)
      } else {
        song.downvotes.splice(index)
      }

      if (song.downvotes.length > VOTE_MAX) {
        this._queue.splice(queueIndex, 1)
      } else {
        this._queue[queueIndex] = song
      }

      if (returnSong) {
        return song
      }
    }
  }
}


export const Player = new PlayerClass()

Player.on('started', async () => {
  await prisma.previousPlays.upsert({
    update: {
      total: {
        increment: 1,
      },
    },
    create: {
      total: 1,
      artist: Player.currentSong.artist,
      album: Player.currentSong.album,
      albumArt: Player.currentSong.albumArt,
      youtubeId: Player.currentSong.youtubeId,
      title: Player.currentSong.title,
      createdAt: new Date(),
    },
    where: {
      youtubeId: Player.currentSong.youtubeId,
    },
  })
})
