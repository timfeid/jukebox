import req from 'graphql-request'
import swr from 'swr'

export function fetch (query: string, variables?: Record<string, any>) {
  return swr(query, (query) => request(query, variables))
}

export function request (query: string, variables?: Record<string, any>) {
  return req('http://localhost:3000/graphql', query, variables)
}
