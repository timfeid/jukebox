import axios from "axios"
import { YTM_ENDPOINT, YTM_PARAMS } from "../config"
import { generateAuthToken } from "../helpers"
import { parseSearch, SearchResult } from "./parse/search"

const context = {
  client: {
    clientName: 'WEB_REMIX',
    clientVersion: '0.1',
    hl: 'en',
    gl: 'US',
  },
  user: {},
}

const headers: Record<string, string> = {
  'content-type': 'application/json',
  'origin': 'https://music.youtube.com',
}

export function createRequest(query, params: Record<string,any>) {
  const authHeader = generateAuthToken(process.env.COOKIE)
  if (authHeader) {
    headers.cookie = process.env.COOKIE,
    headers.authorization = authHeader
  }

  return axios.post(`${YTM_ENDPOINT}search`, {
    query,
    context,
    params: 'EgWKAQIIAWoKEAMQBBAJEAoQBQ%3D%3D',
  }, {
    params,
    headers,
  })
}

export async function continuation(query) {

}

export async function search(query) {
  const limit = 40
  let results: SearchResult[] = []
  try {
    const response = await createRequest(query, YTM_PARAMS)
    results = [...results, ...parseSearch(response.data)]
    let continuations = response.data.contents.sectionListRenderer.contents[0].musicShelfRenderer.continuations

    while (continuations && results.length < limit) {
      const ctoken = continuations[0].nextContinuationData.continuation
      const response2 = await createRequest(query, {
        ...YTM_PARAMS,
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
