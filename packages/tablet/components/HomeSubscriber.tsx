import { gql, useSubscription } from '@apollo/client'
import { useEffect } from 'react'
import { subscribe } from '../context/home'
import { request } from '../fetcher/graphql'
import NowPlaying from './NowPlaying'


const Layout = (props) => {
  subscribe()

  return null
}

export default Layout
