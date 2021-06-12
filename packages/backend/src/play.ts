import { SearchResult } from '@gym/ytm-api'
import debounce from 'debounce'
import EventEmitter from 'events'
import ffmpeg from 'fluent-ffmpeg'
import Speaker from 'speaker'
import { Readable } from 'stream'
import ytdl from 'ytdl-core'
import { prisma } from './prisma-client'
import { CurrentSong } from './schema/current-song'

export class PlayerClass extends EventEmitter {
  private _queue: SearchResult[] = []
  private _currentSong: CurrentSong

  get currentSong () {
    return this._currentSong
  }

  set currentSong (song: CurrentSong) {
    this._currentSong = song
  }

  get queue () {
    return this._queue
  }

  setSongDetails (details: ytdl.videoInfo) {
    this._currentSong.totalTime = parseInt(details.player_response.videoDetails.lengthSeconds, 10)
    this.emit('started')
    this.emit('updated')
  }

  getTimeElapsed(timemark: string) {
    const [hours, minutes, secondsAndMs] = timemark.split(':')
    const [seconds] = secondsAndMs.split('.')

    return parseInt(hours, 10) * 3600
      + parseInt(minutes, 10) * 60
      + parseInt(seconds, 10)
  }

  updateProcess ({timemark}: {timemark: string}) {
    const timeElapsed = this.getTimeElapsed(timemark)

    if (this._currentSong.timeElapsed != timeElapsed) {
      this._currentSong.timeElapsed = timeElapsed
      this.emit('updated')
    }
  }

  restart(youtubeUrl: string, begin: string) {
    const dl = ytdl(youtubeUrl, {
      quality: 'highestaudio',
      filter: 'audioonly',
      begin,
    })

    this.playDl(dl, youtubeUrl)
  }

  playDl(dl: Readable, youtubeUrl: string) {
    let last = '00:00:00.000'
    dl.on('error', (e) => {
      console.log('DOWNLOAD ERROR')
      console.log(e)
      console.log(e.stack)
      this.restart(youtubeUrl, last)
    })
    dl.on('info', this.setSongDetails.bind(this))

    const stream = ffmpeg(dl)
      .outputOptions([
        '-f s16le',
        '-acodec pcm_s16le',
        '-vn',
        '-ac 2',
        '-ar 44100'
      ])

    stream.on('progress', p => {
      this.updateProcess(p)
      console.log(p.timeElapsed)
      last = p.timeElapsed
    })

    stream.on('error', (e) => {
      console.log('STREAM ERROR')
      console.log(e)
      console.log(e.stack)
      this.nextSong()
    })

    const speaker = new Speaker()
      .on('error', (e) => {
        console.log('SPEAKER ERROR')
        console.log(e)
        console.log(e.stack)
      })
      .on('close', this.songEnded.bind(this))

    stream.pipe(speaker)
  }

  play(youtubeUrl: string) {
    const dl = ytdl(youtubeUrl, {
      quality: 'highestaudio',
      filter: 'audioonly',
    })

    this.playDl(dl, youtubeUrl)
  }

  add(song: SearchResult) {
    this.queue.push(song)
    this.emit('added-song')

    this.nextSong()
  }

  songEnded = debounce(function () {
    this.nextSong(true)
  }, 100)

  nextSongIsCurrentSong() {
    const currentSong = new CurrentSong(this.queue.shift())
    currentSong.timeElapsed = 0
    currentSong.totalTime = 0

    return currentSong
  }

  nextSong (forceNext = false) {
    if (forceNext && this.queue.length === 0) {
      this.currentSong = null
    }

    if ((this.currentSong && !forceNext) || this.queue.length === 0) {
      if (this.queue.length === 0 && forceNext) {
        this.emit('updated')
      }
      return
    }

    try {
      this.currentSong = this.nextSongIsCurrentSong()
      if (this.currentSong) {
        Player.play(`https://youtube.com/watch?v=${this.currentSong.youtubeId}`)
      }
    } catch (e) {
      console.log(e)
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
