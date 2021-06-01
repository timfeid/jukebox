import 'reflect-metadata'
import dotenv from 'dotenv'
import { app } from './app'
import { ApolloServer } from 'apollo-server-koa'

dotenv.config()

console.log('hello world')

app.on('ready', (apolloServer: ApolloServer) => {
  const server = app.listen(3000)
  apolloServer.installSubscriptionHandlers(server)

  console.log('listening!')
})

app.onerror = e => {
  console.log(e)
}

process.on('SIGTERM', function () {
  console.log('SIGTERM: Exiting ...')
  process.exit(0)
})

process.on('SIGINT', function () {
  process.exit(-1)
})

process.on('uncaughtException', function (err) {
  console.error(err)
  process.exit(-1)
})
