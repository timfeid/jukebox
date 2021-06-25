import React from 'react'
import { subscribe, usePlayerContext } from '../context/player.context'
// import { usePlayerStateContext } from '../context/player-context'
import Styles from '../styles/NowPlaying.module.scss'
import SongImage from './SongImage'

const NowPlaying = () => {
  const { state } = usePlayerContext()

  subscribe()

  if (!state.currentSong) {
    return null
  }

  return null

  return <div className={Styles.nowPlaying}>
    <div className={Styles.progressContainer}>
      <div className={Styles.progressBar} style={{width: `${state.currentSong.progress}%`}}></div>
    </div>
    <div className={Styles.nowPlayingContainer}>
      <SongImage {...state.currentSong} className={Styles.nowPlayingCard} />
    </div>
  </div>
}

export default NowPlaying
