import { ApolloProvider } from '@apollo/client'
import { useEffect } from 'react'
import apolloClient from '../apollo-client'
import { PlayerActions, PlayerContext, PlayerProvider, subscribe, usePlayerContext } from '../context/player.context'
import { request } from '../fetcher/graphql'
import '../styles/globals.scss'

function MyApp({ Component, pageProps }) {
  return <ApolloProvider client={apolloClient}>
    <PlayerProvider>
      <Component {...pageProps} />
    </PlayerProvider>
  </ApolloProvider>
}

export default MyApp
