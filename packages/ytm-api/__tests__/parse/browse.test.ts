import response from './browse-response.json'
import { expect } from 'chai'
import { parseSearch } from '../../src/api/parse/browse'

describe("youtube parse browse", () => {
  it('parses browse results', () => {

    const parsed = parseSearch(response)
    expect(parsed[0].albumArt).to.eq('https://lh3.googleusercontent.com/1M9pEwvVvTG2YI2R_3TLOBvQncTwQPIHSK-utpct4h8XP9LFdeOhvI-yz7LyQaVx7MxNGlR5M5S24tuApg=w120-h120-s-l90-rj')
    expect(parsed[0].artist).to.eq('Ludacris')
    expect(parsed[0].title).to.eq('Rollout (My Business)')
    expect(parsed[0].album).to.eq('Word Of Mouf')
    expect(parsed[0].youtubeId).to.eq('lUphaGuaRLg')
  })

  // it('parses another version', () => {
  //   const parsed = parseSearch(response2)

  //   // console.log(parsed)
  // })
})
