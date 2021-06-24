import response from './search-response.json'
import response2 from './search-response2.json'
import { expect } from 'chai'
import { parseSearch } from '../../src/api/parse/search'

describe("youtube parse search", () => {
  it('parses search results', () => {

    const parsed = parseSearch(response)
    expect(parsed[0].albumArt).to.eq('https://lh3.googleusercontent.com/etTz20YiB4ccbsUO2yLrCY9wSS9GybYF5qJh-j5tu8MLTqP2GjgROiBt_4JUC5rjnnd_RiuWa3ndUAeO=w120-h120-l90-rj')
    expect(parsed[0].artist).to.eq('AC/DC')
    expect(parsed[0].title).to.eq('Hells Bells')
    expect(parsed[0].album).to.eq('Back In Black')
    expect(parsed[0].youtubeId).to.eq('GL56LY6fE0E')

  })

  // it('parses another version', () => {
  //   const parsed = parseSearch(response2)

  //   // console.log(parsed)
  // })
})
