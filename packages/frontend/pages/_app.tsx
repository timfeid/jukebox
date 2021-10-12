import { ApolloProvider } from '@apollo/client'
import { useEffect } from 'react'
import apolloClient from '../apollo-client'
import { PlayerActions, PlayerContext, PlayerProvider, subscribe, usePlayerContext } from '../context/player.context'
import { UserProvider } from '../context/user.context'
import { request } from '../fetcher/graphql'
import '../styles/globals.scss'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MyApp({ Component, pageProps }) {
  return <ApolloProvider client={apolloClient}>
    <PlayerProvider>
      <UserProvider>
        <Component {...pageProps} />
        <ToastContainer
          position='bottom-center'
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover
          theme="dark"
        />
      </UserProvider>
    </PlayerProvider>
  </ApolloProvider>
}

export default MyApp
