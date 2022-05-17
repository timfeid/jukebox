import { createSignal } from 'solid-js'
import { gqlClient, subscriptionClient } from './request'

export const [currentSong, setCurrentSong] = createSignal(undefined)
export const [queue, setQueue] = createSignal([])

subscriptionClient.request({
  query: `subscription {
      onPlayerUpdated {
        currentSong {
          title
          album
          albumArt
          artist
          timeElapsed
          totalTime
        }
        queue {
          title
          album
          albumArt
          artist
          upvotes
          downvotes
        }
      }
    }
  `
}).subscribe({
  next({data}) {
    setCurrentSong(data.onPlayerUpdated.currentSong)
    setQueue(data.onPlayerUpdated.queue)
  }
})
