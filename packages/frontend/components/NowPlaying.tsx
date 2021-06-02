import { fetch, request } from '../fetcher/graphql'
import React, { useEffect } from 'react'
import SongCard from './SongCard'
import { PlayerActions, subscribe, usePlayerContext } from '../context/player.context'
import { useSubscription } from '@apollo/client'
// import { usePlayerStateContext } from '../context/player-context'
import Styles from '../styles/NowPlaying.module.scss'

const NowPlaying = () => {
  const { state } = usePlayerContext()

  subscribe()

  if (state.currentSong) {
    const width = (state.currentSong.totalTime === 0
      ? 0
      : (state.currentSong.timeElapsed / state.currentSong.totalTime * 100)).toFixed(2)

    return <div className={Styles.nowPlaying}>
      <div className={Styles.progressContainer}>
        <div className={Styles.progressBar} style={{width: `${width}%`}}></div>
      </div>
      <div className={Styles.nowPlayingContainer}>
        <SongCard {...state.currentSong} />
      </div>
    </div>
  }

  return <div>Nothing playing</div>
}

export default NowPlaying
