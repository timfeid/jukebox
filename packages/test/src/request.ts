import {request as req, RequestDocument, GraphQLClient} from 'graphql-request'
import { SubscriptionClient } from "graphql-subscriptions-client";

const gqlEndpoint = 'http://localhost:3000/graphql'
const wsEndpoint = `ws${gqlEndpoint.replace(/^https?/, '')}`

export const subscriptionClient = new SubscriptionClient(wsEndpoint, {
  reconnect: true,
  lazy: true, // only connect when there is a query
  connectionCallback: (error) => {
    error && console.error(error);
  },
});

export const gqlClient = new GraphQLClient(gqlEndpoint)

export function request(query: RequestDocument, variables?: Object) {
  return gqlClient.request(query, variables)
}
