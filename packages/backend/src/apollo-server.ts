import { ApolloServer } from 'apollo-server-koa'
import { buildSchema } from 'type-graphql'
import { pubSub } from './pubsub'
import { resolvers } from './resolvers'

export async function createApolloServer() {
  const schema = await buildSchema({
    resolvers,
    pubSub,
  })

  return new ApolloServer({
    schema,
    context: ({ctx}) => {
      // console.log(ctx.req)

      return ctx
    },
  })
}
