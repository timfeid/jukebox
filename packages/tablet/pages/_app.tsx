import { ApolloProvider } from '@apollo/client'
import 'react-circular-progressbar/dist/styles.css'
import apolloClient from '../apollo-client'
import HomeSubscriber from '../components/HomeSubscriber'
import { HomeProvider } from '../context/home'
import { PlayerProvider } from '../context/player.context'
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
