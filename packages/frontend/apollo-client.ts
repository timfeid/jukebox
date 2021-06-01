import { ApolloClient, ApolloLink, InMemoryCache, split } from "@apollo/client"
import { HttpLink } from "@apollo/client"
import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition } from "@apollo/client/utilities"

const httpLink = new HttpLink({
  uri: "http://localhost:3000/graphql",
})

const wsLink = process.browser ? new WebSocketLink({
  uri: "ws://localhost:3000/graphql",
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
