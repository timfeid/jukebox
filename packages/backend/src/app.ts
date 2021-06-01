import Koa from 'koa'
import koaBody from 'koa-bodyparser'
import { createApolloServer } from './apollo-server'

const app = new Koa()

app.use(koaBody())

createApolloServer().then(server => {
  server.applyMiddleware({ app })
  app.emit('ready', server)
})

app.on('error', e => console.log(e))
app.onerror = (e) => { console.log(e) }

export {app}
