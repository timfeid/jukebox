import req from 'graphql-request'
import swr from 'swr'
import { config } from '../config'

export function fetch (query: string, variables?: Record<string, any>) {
  return swr(query, (query) => request(query, variables))
}

export function request (query: string, variables?: Record<string, any>) {
  return req(config.graphqlEndpoint, query, variables)
}
