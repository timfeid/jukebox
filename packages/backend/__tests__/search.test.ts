import { gql } from 'apollo-server-core'
import {expect} from 'chai'
import { testClient, prisma } from './test-client'
import faker from 'faker'
import sinon from 'ts-sinon'
import { API, SearchResult } from '@gym/ytm-api'

describe("search", () => {
  it('calls the search from ytm-api', async () => {
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
        youtubeId: null,
      },

      {
        artist: faker.name.firstName(),
        albumArt: faker.image.imageUrl(),
        title: faker.lorem.sentence(),
        album: faker.lorem.sentence(),
        youtubeId: null,
      },
    ]
    const input = faker.lorem.sentence()
    const mock = sinon.stub(API, 'search').returns(new Promise(resolve => resolve(results)))



    const response = await testClient.query({
      query: gql`
        query ($input: String!) {
          search(input: $input) {
            artist
            albumArt
            title
            album
            youtubeId
          }
        }
      `,
      variables: {
        input,
      },
    })



    expect(mock.calledOnceWithExactly(input)).to.eq(true)
    expect(response.data.search).to.have.lengthOf(1)
    expect(response.data.search[0]).to.have.property('artist').eq(results[0].artist)
    expect(response.data.search[0]).to.have.property('albumArt').eq(results[0].albumArt)
    expect(response.data.search[0]).to.have.property('title').eq(results[0].title)
    expect(response.data.search[0]).to.have.property('album').eq(results[0].album)
    expect(response.data.search[0]).to.have.property('youtubeId').eq(results[0].youtubeId)
  })
})
