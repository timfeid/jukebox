import { fetch, request } from '../fetcher/graphql'
import React, { useEffect } from 'react'
import SongCard from './SongCard'
import { PlayerActions, subscribe, usePlayerContext } from '../context/player.context'
import { useSubscription } from '@apollo/client'
// import { usePlayerStateContext } from '../context/player-context'

const NowPlaying = () => {
  const { state } = usePlayerContext()

  subscribe()

  if (state.currentSong) {
    return <SongCard {...state.currentSong} />
  }

  return <div>Nothing playing</div>
}

export default NowPlaying
