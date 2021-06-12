import { fetch, request } from '../fetcher/graphql'
import React, { useEffect } from 'react'
import SongImage from './SongImage'
import { PlayerActions, subscribe, usePlayerContext } from '../context/player.context'
import { useSubscription } from '@apollo/client'
// import { usePlayerStateContext } from '../context/player-context'
import Styles from '../styles/NowPlaying.module.scss'

const NowPlaying = () => {
  const { state } = usePlayerContext()

  subscribe()

  if (!state.currentSong) {
    return null
  }

  const width = (state.currentSong.totalTime === 0
    ? 0
    : (state.currentSong.timeElapsed / state.currentSong.totalTime * 100)).toFixed(2)

  return <div className={Styles.nowPlaying}>
    <div className={Styles.progressContainer}>
      <div className={Styles.progressBar} style={{width: `${width}%`}}></div>
    </div>
    <div className={Styles.nowPlayingContainer}>
      <SongImage {...state.currentSong} className={Styles.nowPlayingCard} />
    </div>
  </div>
}

export default NowPlaying
