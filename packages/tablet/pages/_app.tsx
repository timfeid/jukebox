import { ApolloProvider } from '@apollo/client'
import { useEffect } from 'react'
import apolloClient from '../apollo-client'
import Layout from '../components/Layout'
import { PlayerActions, PlayerContext, PlayerProvider, usePlayerContext } from '../context/player.context'
import { HomeProvider, subscribe } from '../context/home'
import HomeSubscriber from '../components/HomeSubscriber'
import { request } from '../fetcher/graphql'
import '../styles/globals.scss'

function MyApp({ Component, pageProps }) {
  return <ApolloProvider client={apolloClient}>
    <PlayerProvider>
      <HomeProvider>
        <HomeSubscriber />
        <Component {...pageProps} />
      </HomeProvider>
    </PlayerProvider>
  </ApolloProvider>
}

export default MyApp
