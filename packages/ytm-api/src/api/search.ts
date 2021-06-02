import { createRequest } from "./create-request"
import { parseSearch, SearchResult } from "./parse/search"


export async function search(query: string) {
  const limit = 40
  let results: SearchResult[] = []
  try {
    const response = await createRequest('search', {query})
    results = [...results, ...parseSearch(response.data)]
    let continuations = response.data.contents.sectionListRenderer.contents[0].musicShelfRenderer.continuations

    while (continuations && results.length < limit) {
      const ctoken = continuations[0].nextContinuationData.continuation
      const response2 = await createRequest('search', {
        query,
        ctoken,
      })
      results = [...results, ...parseSearch(response2.data)]
      continuations = response2.data.contents.sectionListRenderer.contents[0].musicShelfRenderer.continuations
    }


    return results
  } catch (e) {
    console.error(e)
    console.log(e.response.data.error.errors)
  }
}
