import axios, { AxiosRequestConfig } from "axios"
import { YTM_ENDPOINT, YTM_PARAMS } from "../config"
import { generateAuthToken } from "../helpers"

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

export function createRequest(url: string, data: Record<string, any>, config?: AxiosRequestConfig) {
  const authHeader = generateAuthToken(process.env.COOKIE)
  if (authHeader) {
    headers.cookie = process.env.COOKIE,
    headers.authorization = authHeader
  }

  return axios.post(`${YTM_ENDPOINT}${url}`, {
    ...data,
    context,
    params: 'EgWKAQIIAWoKEAMQBBAJEAoQBQ%3D%3D',
  }, {
    params: YTM_PARAMS,
    headers,
  })
}
