import { gql, useSubscription } from '@apollo/client'
import { useEffect } from 'react'
import { getCurrentSong, PlayerActions, subscribe, usePlayerContext } from '../context/player.context'
import { request } from '../fetcher/graphql'
import styles from '../styles/Layout.module.scss'
import NowPlaying from './NowPlaying'
import Search from './Search'


const Layout = (props) => {
  const { dispatch } = usePlayerContext()

  useEffect(() => {
    getCurrentSong(dispatch)
  }, [false])

  return <div className={styles.container}>
    <div className={styles.header}>
      <div className={styles.headerContainer}>
        <Search />
      </div>

    </div>
    <div className={styles.main}>
      {props.children}
    </div>
    <NowPlaying />
  </div>
}

export default Layout
