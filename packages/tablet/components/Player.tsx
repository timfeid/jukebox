import { PlayerState, usePlayerContext } from '../context/player.context'
import { request } from '../fetcher/graphql'
import Styles from '../styles/Player.module.scss'
import SongImage from './SongImage'
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

  const continuouslyPlay = async (playlistId: string, videos = false) => {
    const response = await request(`mutation($playlistId: String!, $videos: Boolean!) {
      continuousPlay(continuousPlay: true, playlistId: $playlistId, videos: $videos) {
        isPlayingContinuously
      }
    }`, {playlistId, videos})

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
        <div style={{gridTemplateColumns: 'repeat(8, minmax(0, 1fr))'}} className="grid justify-between w-full m-3">
          {state.isPlayingContinuously && <div onClick={() => stopContinuouslyPlay()}>
            Turn off
          </div>}
          <div onClick={() => continuouslyPlay('VLRDTMAK5uy_kset8DisdE7LSD4TNjEVvrKRTmG7a56sY')}>
            Tim's autoplay
          </div>
          <div onClick={() => continuouslyPlay('VLRDCLAK5uy_l2pHac-aawJYLcesgTf67gaKU-B9ekk1o')}>
            00's hits
          </div>
          <div onClick={() => continuouslyPlay('VLRDCLAK5uy_mGYde2Wyx9INZd6GbPcMWkxDOu6Utmedw')}>
            10's hits
          </div>
          <div onClick={() => continuouslyPlay('VLRDCLAK5uy_k2u2jgHBqCiaxlmoV-1AO227ocJLIVKbk')}>
            Pop Punk
          </div>
          <div onClick={() => continuouslyPlay('VLRDCLAK5uy_kTryekD5_prNBl8eu44N_x2w6zPyZUNt0')}>
            Southern BBQ
          </div>
          <div onClick={() => continuouslyPlay('VLPL4fGSI1pDJn6O1LS0XSdF3RyO0Rq_LDeI')}>
            Top 100 in the USA
          </div>
          <div onClick={() => continuouslyPlay('PLgrYDatnhwJKRKu5JWyh0WNjveSDHBIik', true)}>
            Top 100 EDM
          </div>
        </div>
      </div>

    </div>
  )
}
