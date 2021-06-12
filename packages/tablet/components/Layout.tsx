import { gql, useSubscription } from '@apollo/client'
import { useEffect } from 'react'
import { getCurrentSong, PlayerActions, subscribe, usePlayerContext } from '../context/player.context'
import { request } from '../fetcher/graphql'
import styles from '../styles/Layout.module.scss'
import NowPlaying from './NowPlaying'


const Layout = (props) => {
  const { dispatch } = usePlayerContext()

  useEffect(() => {
    getCurrentSong(dispatch)
  }, [false])

  return <div>
    <div className="flex">
      <div className={styles.nav}>
        some left navigation
      </div>
      <div className={styles.container}>
        {props.children}
      </div>
    </div>
    <NowPlaying />
  </div>
}

export default Layout
