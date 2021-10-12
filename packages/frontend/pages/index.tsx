import Layout from '../components/Layout'
import SongCard from '../components/SongCardWithVoting'
import { PlayerState, usePlayerContext } from '../context/player.context'
import { SwipeableList, SwipeableListItem } from '@sandstreamdev/react-swipeable-list'
import { AiFillDislike, AiFillLike, AiOutlineDislike, AiOutlineLike } from 'react-icons/ai'
import { request } from '../fetcher/graphql'
import { getCurrentUser, useUserContext } from '../context/user.context'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export default function Home() {
  const { state } = usePlayerContext()
  const user = useUserContext()
  const [ isUpvoting, setIsUpvoting ] = useState(false)
  const [ isDownvoting, setIsDownvoting ] = useState(false)

  function generateSongQueue(player: PlayerState) {
    if (player.queue.length === 0) {
      return <div></div>
    }

    const upvote = async (key: number) => {
      setIsUpvoting(true)
      await request(`mutation {
        upvote(songIndex: ${key})
      }`)
      setTimeout(() => setIsUpvoting(false), 500)
    }

    const downvote = async (key: number) => {
      setIsDownvoting(true)
      await request(`mutation {
        downvote(songIndex: ${key})
      }`)
      setTimeout(() => setIsDownvoting(false), 500)
    }

    const songCards = player.queue.map((song, key) => {
      return (
        <SwipeableListItem
          swipeLeft={{
            content: (isUpvoting || song.upvotes.includes(user.state.mac) ? <AiFillLike size="24" /> : <AiOutlineLike size="24" />),
            action: () => upvote(key)
          }}
          swipeRight={{
            content: (isDownvoting || song.downvotes.includes(user.state.mac) ? <AiFillDislike size="24" /> : <AiOutlineDislike size="24" />),
            action: () => downvote(key)
          }}
          key={key}
        >
          <SongCard {...song} className={"mb-3 w-full"} />
        </SwipeableListItem>
      )
    })

    return (
      <SwipeableList>
        {songCards}
      </SwipeableList>
    )
  }

  useEffect(() => {

    getCurrentUser(user.dispatch)
  }, [false])

  return (
    <Layout>
      <div style={{maxWidth: "36rem"}}>
        {generateSongQueue(state)}
      </div>
    </Layout>
  )
}
