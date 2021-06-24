// import axios from 'axios'
import Koa from 'koa'
import koaBody from 'koa-bodyparser'
import { createApolloServer } from './apollo-server'
import request from 'request'
import ffmpeg from 'fluent-ffmpeg'
import { WriteStream } from 'fs'
import { createWriteStream } from 'fs'
import stream from 'stream'
import { Player } from './play'

const app = new Koa()
const devices = []

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
//     ctx.body =  converter.pipe(stream.PassThrough(), {end: true});

//   } else {
//     return next()
//   }

// })
app.use(async (context, next) => {
  let matched
  if (!devices.length) {

    // try {

    //   const response = await axios.get('http://10.30.0.1/QOS_device_info.htm', {
    //     headers: {
    //       authorization: 'Basic YWRtaW46UmVhZHlAODA='
    //     }
    //   })

    //   const info = eval(response.data)
    //   info.map(device => {
    //     devices.push(device)
    //   })

    // } catch (e) {
    //   console.error(e)
    // }

  }

  const matches = context.ip.match(/(?:[0-9]{1,3}\.){3}[0-9]{1,3}/)
  if (matches) {
    matched = matches[0]
    const matchedDevice = devices.filter(device => device.ip === matched)
    if (matchedDevice.length) {
      matched = matchedDevice[0].name
    }
  }

  if (!matched) {
    matched = context.ip
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

