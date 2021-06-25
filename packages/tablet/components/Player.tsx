import Layout from './Layout'
import SongImage from './SongImage'
import { PlayerState, usePlayerContext } from '../context/player.context'
import Styles from '../styles/Player.module.scss'
import TopSongs from './TopSongs'
import { request } from '../fetcher/graphql'

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

  const continuouslyPlay = async (playlistId: string) => {
    const response = await request(`mutation($playlistId: String!) {
      continuousPlay(continuousPlay: true, playlistId: $playlistId) {
        isPlayingContinuously
      }
    }`, {playlistId})

    console.log(response)
  }

  const stopContinuouslyPlay = async () => {
    const response = await request(`mutation {
      continuousPlay(continuousPlay: false) {
        isPlayingContinuously
      }
    }`)

    console.log(response)
  }

  const reset = async () => {
    const response = await request(`mutation {
      reset {
        isPlayingContinuously
      }
    }`)

    console.log(response)
  }

  return (
    <div className="overflow-hidden h-full">
      <h1 onClick={() => reset()} className={Styles.header}>
        Queue
      </h1>
      <div className={Styles.grid}>
        {generateSongQueue(state)}
      </div>

      <h1 className={`${Styles.header} mt-6`}>
        Top Songs
      </h1>
      <TopSongs topSongs={state.queue} />

      <h1 className={`${Styles.header} mt-6`}>
        Continous play is {state.isPlayingContinuously ? 'on' : 'off'}
      </h1>
      <div className={Styles.grid}>
        <div style={{gridTemplateColumns: 'repeat(3, minmax(0, 1fr))'}} className="grid justify-between w-full m-3">
          {state.isPlayingContinuously && <div onClick={() => stopContinuouslyPlay()}>
            Turn off
          </div>}
          <div onClick={() => continuouslyPlay('VLRDTMAK5uy_kset8DisdE7LSD4TNjEVvrKRTmG7a56sY')}>
            Autoplay mix
          </div>
          <div onClick={() => continuouslyPlay('VLPLY-ORNzeWA4-KT2scgfKiQrOmQ1ihDpHB')}>
            Toons
          </div>
        </div>
      </div>

    </div>
  )
}
