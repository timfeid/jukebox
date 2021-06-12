import { gql } from 'apollo-server-core'
import chai, {expect} from 'chai'
import { testClient, prisma } from './test-client'
import faker from 'faker'
import sinon from 'ts-sinon'
import { API, SearchResult } from '@gym/ytm-api'
import Prisma from '.prisma/client'
import chaiSubset from 'chai-subset'

chai.use(chaiSubset)

function createSong (): Prisma.PreviousPlays {
  return {
    title: faker.lorem.sentence(),
    album: faker.lorem.sentence(),
    albumArt: faker.image.imageUrl(),
    artist: faker.name.findName(),
    youtubeId: faker.unique(faker.lorem.word),
    createdAt: new Date(),
    updatedAt: new Date(),
    total: faker.datatype.number(100),
  }
}

describe("most-popular", () => {
  it('songs', async () => {
    const songs: Prisma.PreviousPlays[] = []
    for (let i = 0; i < 20; i++) {
      songs.push(createSong())
    }

    await prisma.previousPlays.createMany({
      data: songs,
    })

    const response = await testClient.query({
      query: gql`
        query {
          mostPopularSongs(take: 10) {
            artist
            albumArt
            title
            album
            youtubeId
            total
          }
        }
      `,
    })


    expect(response.data.mostPopularSongs).to.have.lengthOf(10)

    const check = songs.sort((a,b) => a.total < b.total ? 1 : -1).slice(0, 10).map(({
      artist,
      albumArt,
      title,
      album,
      youtubeId,
      total,
    }) => ({
      artist,
      albumArt,
      title,
      album,
      youtubeId,
      total,
    }))

    expect(response.data.mostPopularSongs).to.containSubset(check)
  })
})
