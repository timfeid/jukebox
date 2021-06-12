import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, split } from "@apollo/client"
import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition } from "@apollo/client/utilities"
import { config } from "./config"

const graphqlEndpoint = config.graphqlEndpoint
const wsEndpoint = graphqlEndpoint.replace(/https?:/, 'ws:')

const httpLink = new HttpLink({
  uri: graphqlEndpoint,
})

const wsLink = process.browser ? new WebSocketLink({
  uri: wsEndpoint,
  options: {
    reconnect: true
  }
}) : null

const splitLink = process.browser ? split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  httpLink,
) : httpLink

export default new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([splitLink]),
})
