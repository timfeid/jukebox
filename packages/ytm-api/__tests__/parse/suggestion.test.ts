import response from './suggestion-response.json'
import { expect } from 'chai'
import { parseSuggestions } from '../../src/api/parse/suggestions'

describe("suggestion parsing", () => {
  it('parses suggestion results', () => {

    const parsed = parseSuggestions(response)
    expect(parsed[0].runs[0]).to.have.property('text').eq('piece of your heart')
    expect(parsed[0].runs[1]).to.have.property('text').eq(' meduza')
    expect(parsed[0].query).to.eq('piece of your heart meduza')

    console.log(parsed[0].runs)
  })

  // it('parses another version', () => {
  //   const parsed = parseSearch(response2)

  //   // console.log(parsed)
  // })
})
