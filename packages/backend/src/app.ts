// import axios from 'axios'
import Koa from 'koa'
import koaBody from 'koa-bodyparser'
import { createApolloServer } from './apollo-server'
import Netgear from 'netgear'

const app = new Koa()
let devices: any[] = []

app.use(koaBody())
// a terrible idea
// app.use(async (ctx, next) => {
//   if (ctx.request.path === '/test' && Player.currentSong) {
//     const path = Player.currentSong.url
//     console.log('playing mp3 from', path)
//     const converter = ffmpeg(request(path))
//       .toFormat('mp3')
//       .withAudioCodec('libmp3lame')
//       .toFormat('mp3')

//     ctx.response.attachment('audio.mp3')
//     ctx.response.type = 'mp3'
//     ctx.body =  converter.pipe(stream.PassThrough(), {end: true})

//   } else {
//     return next()
//   }

// })

const router = new Netgear()
const options = {
  password: process.env.NETGEAR_PASSWORD,
  host: process.env.NETGEAR_GATEWAY,
  port: process.env.NETGEAR_PORT || 80,
}

function login () {
  return router.login(options)
}

let retries = 0
async function refreshDevices () {
  try {
    devices = await router.getAttachedDevices()
    retries = 0
  } catch (e) {
    if (retries++ < 1) {
      await login()
      await refreshDevices()
    }
  }
}

let tr = 0
async function getAllDevices () {
  try {
    console.log(await router.getDeviceListAll())
    tr = 0
  } catch (e) {
    console.log(e)
    if (tr++ < 1) {
      await login()
      await getAllDevices()
    }
  }
}

async function refresh () {
  refreshDevices()
  setTimeout(refresh, 30000)
}

refresh()
getAllDevices()

app.use(async (ctx, next) => {
  let ip = '10.30.0.16'

  const matches = ctx.ip.match(/(?:[0-9]{1,3}\.){3}[0-9]{1,3}/)
  if (matches) {
    ip = matches[0]
  }

  if (ip) {
    const matchingDevices = devices.filter(device => device.IP === ip)
    if (matchingDevices.length) {
      ctx.device = matchingDevices[0]
      ctx.set('Matched-Device', matchingDevices[0].Name)
      // console.log(matchingDevices[0].Name)
    }

  }

  return next()

})

createApolloServer().then(server => {
  server.applyMiddleware({ app })
  app.emit('ready', server)
})

app.on('error', e => console.log(e))
app.onerror = (e) => { console.log(e) }

export { app }

