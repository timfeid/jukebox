import Layout from '../components/Layout'
import SongCard from '../components/SongCard'
import { PlayerState, usePlayerContext } from '../context/player.context'

function generateSongQueue(player: PlayerState) {
  if (player.queue.length === 0) {
    return <div></div>
  }

  return player.queue.map((song, key) => {
    return <SongCard {...song} key={key} className={"mb-3"} />
  })
}

export default function Home() {
  const { state } = usePlayerContext()

  return (
    <Layout>
      <div style={{width: "36rem"}}>
        {generateSongQueue(state)}
      </div>
    </Layout>
  )
}
