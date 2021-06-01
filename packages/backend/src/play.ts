import ytdl from 'ytdl-core'
import Speaker from 'speaker'
import ffmpeg from 'fluent-ffmpeg'
// @ts-ignore
import lame from '@suldashi/lame'
import { SearchResult } from '@gym/ytm-api'
import fs from 'fs'
import path from 'path'
import { Stream } from 'stream'
import debounce from 'debounce'
import { pubSub } from './pubsub'
import { TOPICS } from './resolvers/player.resolver'
import EventEmitter from 'events'

export class PlayerClass extends EventEmitter {
  private _queue: SearchResult[] = []
  private _currentSong: SearchResult

  get currentSong () {
    return this._currentSong
  }

  set currentSong (song: SearchResult) {
    this._currentSong = song
  }

  get queue () {
    return this._queue
  }

  play(youtubeUrl: string) {
    const dl = ytdl(youtubeUrl, {
      quality: 'highestaudio',
      filter: 'audioonly',
    }).on('error', (e) => console.log(e))
    // const dl = fs.createReadStream(path.join(__dirname, './track.mp3'))

    const stream = ffmpeg(dl)
      .outputOptions([
        '-f s16le',
        '-acodec pcm_s16le',
        '-vn',
        '-ac 2',
        '-ar 44100'
      ])

    const speaker = new Speaker()
      .on('close', this.songEnded.bind(this))

    stream.pipe(speaker)

    this.emit('play')
  }

  add(song: SearchResult) {
    this.queue.push(song)

    this.nextSong()
  }

  songEnded = debounce(function () {
    this.nextSong(true)
  }, 100)

  nextSong (forceNext = false) {
    if (forceNext && this.queue.length === 0) {
      this.currentSong = null
    }

    if ((this.currentSong && !forceNext) || this.queue.length === 0) {
      return
    }

    try {
      this.currentSong = this.queue.shift()
      if (this.currentSong) {
        Player.play(`https://youtube.com/watch?v=${this.currentSong.youtubeId}`)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const Player = new PlayerClass()
