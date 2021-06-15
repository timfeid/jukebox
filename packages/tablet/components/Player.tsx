import Layout from './Layout'
import SongImage from './SongImage'
import { PlayerState, usePlayerContext } from '../context/player.context'
import Styles from '../styles/Player.module.scss'
import TopSongs from './TopSongs'

function generateSongQueue(player: PlayerState) {
  if (player.queue.length === 0) {
    return <div></div>
  }

  return player.queue.map((song, key) => {
    return <SongImage {...song} key={key} className={"mb-3 flex-col"} />
  })
}

export default function Home() {
  const { state } = usePlayerContext()
  return (
    <div style={{overflow: 'hidden'}}>
      <h1 className={Styles.header}>
        Queue
      </h1>
      <div className={Styles.grid}>
        {generateSongQueue(state)}
      </div>

      <h1 className={`${Styles.header} mt-6`}>
        Top Songs
      </h1>
      <TopSongs topSongs={state.queue} />
    </div>
  )
}
