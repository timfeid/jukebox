import { PubSub } from 'apollo-server-koa'
import { Player } from './play'

export const pubSub = new PubSub()

export enum TOPICS {
  QUEUE = "QUEUE",
  CURRENT_SONG = "CURRENT_SONG",
  BROADCAST = "BROADCAST",
}

Player.on('updated', () => {
  pubSub.publish(TOPICS.CURRENT_SONG, Player)
})

Player.on('added-song', () => {
  pubSub.publish(TOPICS.QUEUE, Player)
})
