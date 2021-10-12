// import axios from 'axios'
import Koa from 'koa'
import koaBody from 'koa-bodyparser'
import { createApolloServer } from './apollo-server'
import { getDeviceByIp } from './router'

const app = new Koa()

const getIpFromCtx = (ip: string) => {
  return ip === '::1' ? '10.30.0.18' : ip
}

// app.use(async (ctx, next) => {
//   console.log(await getDeviceByIp(getIpFromCtx(ctx.ip)))
//   return next()
// })

app.use(koaBody())


createApolloServer().then(server => {
  server.applyMiddleware({ app })
  app.emit('ready', server)
})

app.on('error', e => console.log(e))
app.onerror = (e) => { console.log(e) }

export { app }

