import { gql } from 'apollo-server-core'
import {expect} from 'chai'
import { testClient, prisma } from './test-client'
import faker from 'faker'
import sinon from 'ts-sinon'
import { API, SearchResult } from '@gym/ytm-api'
import { Player } from '../src/play'

describe("player", () => {
  beforeEach(async () => {
    sinon.restore()
  })

  it('gets current player stats', async () => {
    const results: SearchResult[] = [
      {
        artist: faker.name.firstName(),
        albumArt: faker.image.imageUrl(),
        title: faker.lorem.sentence(),
        album: faker.lorem.sentence(),
        youtubeId: faker.lorem.word(),
      },

      {
        artist: faker.name.firstName(),
        albumArt: faker.image.imageUrl(),
        title: faker.lorem.sentence(),
        album: faker.lorem.sentence(),
        youtubeId: faker.lorem.word(),
      },

      {
        artist: faker.name.firstName(),
        albumArt: faker.image.imageUrl(),
        title: faker.lorem.sentence(),
        album: faker.lorem.sentence(),
        youtubeId: faker.lorem.word(),
      },
    ]

    sinon.stub(Player, 'currentSong').get(() => results[0])
    sinon.stub(Player, 'queue').get(() => [results[1], results[2]])

    const response = await testClient.query({
      query: gql`
        query {
          player {
            currentSong {
              artist
              albumArt
              title
              album
              youtubeId
            }
            queue {
              artist
              albumArt
              title
              album
              youtubeId
            }
          }
        }
      `,
    })

    expect(response.data.player.currentSong).to.have.property('artist').eq(results[0].artist)
    expect(response.data.player.currentSong).to.have.property('albumArt').eq(results[0].albumArt)
    expect(response.data.player.currentSong).to.have.property('title').eq(results[0].title)
    expect(response.data.player.currentSong).to.have.property('album').eq(results[0].album)
    expect(response.data.player.currentSong).to.have.property('youtubeId').eq(results[0].youtubeId)

    expect(response.data.player.queue).to.have.lengthOf(2)
  })

  it('plays a song', async () => {

    const song: SearchResult = {
      artist: faker.name.firstName(),
      albumArt: faker.image.imageUrl(),
      title: faker.lorem.sentence(),
      album: faker.lorem.sentence(),
      youtubeId: faker.lorem.word(),
    }

    const mock = sinon.stub(Player, 'play').returns(null)

    const response = await testClient.query({
      query: gql`
        mutation playSong($artist: String!, $title: String!, $albumArt: String!, $album: String!, $youtubeId: String!) {
          play(artist: $artist, title: $title, albumArt: $albumArt, album: $album, youtubeId: $youtubeId) {
            currentSong {
              artist
              albumArt
              title
              album
              youtubeId
            }
            queue {
              artist
              albumArt
              title
              album
              youtubeId
            }
          }
        }
      `,
      variables: song,
    })

    expect(mock.calledOnceWithExactly(`https://youtube.com/watch?v=${song.youtubeId}`)).to.eq(true)
    expect(response.data.play.currentSong).to.have.property('artist').eq(song.artist)
    expect(response.data.play.currentSong).to.have.property('albumArt').eq(song.albumArt)
    expect(response.data.play.currentSong).to.have.property('title').eq(song.title)
    expect(response.data.play.currentSong).to.have.property('album').eq(song.album)
    expect(response.data.play.currentSong).to.have.property('youtubeId').eq(song.youtubeId)
  })

  it('adds a song to the queue', async () => {

    const song: SearchResult = {
      artist: faker.name.firstName(),
      albumArt: faker.image.imageUrl(),
      title: faker.lorem.sentence(),
      album: faker.lorem.sentence(),
      youtubeId: faker.lorem.word(),
    }
    const currentSong: SearchResult = {
      artist: faker.name.firstName(),
      albumArt: faker.image.imageUrl(),
      title: faker.lorem.sentence(),
      album: faker.lorem.sentence(),
      youtubeId: faker.lorem.word(),
    }

    sinon.stub(Player, 'currentSong').get(() => currentSong)

    const mock = sinon.stub(Player, 'play').returns(null)

    const response = await testClient.query({
      query: gql`
        mutation playSong($artist: String!, $title: String!, $albumArt: String!, $album: String!, $youtubeId: String!) {
          play(artist: $artist, title: $title, albumArt: $albumArt, album: $album, youtubeId: $youtubeId) {
            currentSong {
              artist
              albumArt
              title
              album
              youtubeId
            }
            queue {
              artist
              albumArt
              title
              album
              youtubeId
            }
          }
        }
      `,
      variables: song,
    })

    expect(mock.notCalled).to.eq(true)
    expect(response.data.play.currentSong).to.have.property('artist').eq(currentSong.artist)
    expect(response.data.play.currentSong).to.have.property('albumArt').eq(currentSong.albumArt)
    expect(response.data.play.currentSong).to.have.property('title').eq(currentSong.title)
    expect(response.data.play.currentSong).to.have.property('album').eq(currentSong.album)
    expect(response.data.play.currentSong).to.have.property('youtubeId').eq(currentSong.youtubeId)

    expect(response.data.play.queue[0]).to.have.property('artist').eq(song.artist)
    expect(response.data.play.queue[0]).to.have.property('albumArt').eq(song.albumArt)
    expect(response.data.play.queue[0]).to.have.property('title').eq(song.title)
    expect(response.data.play.queue[0]).to.have.property('album').eq(song.album)
    expect(response.data.play.queue[0]).to.have.property('youtubeId').eq(song.youtubeId)
  })
})
