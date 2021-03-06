import { useSubscription, gql } from '@apollo/client'
import { createContext, Dispatch, useContext, useEffect, useReducer } from 'react'
import {SearchResult} from '../../backend/src/schema/search'
import {CurrentSong} from '../../backend/src/schema/current-song'
import apolloClient from '../apollo-client'
import { request } from '../fetcher/graphql'
import { toast } from 'react-toastify'

type PlayerStore = {
  state: PlayerState
  dispatch?: Dispatch<PlayerAction>
}

export type PlayerState = {
  currentSong: CurrentSong | null,
  queue: SearchResult[]
}

export enum PlayerActions {
  SET_QUEUE = 'SET_QUEUE',
  POPULATE = 'POPULATE',
  SET_CURRENT_SONG = 'SET_CURRENT_SONG',
}

type PlayerActionQueue = {
  type: PlayerActions.SET_QUEUE,
  queue: SearchResult[]
}

type PlayerActionCurrentSong = {
  type: PlayerActions.SET_CURRENT_SONG,
  song: CurrentSong
}

type PlayerActionPopulate = {
  type: PlayerActions.POPULATE,
  payload: PlayerState,
}

export type PlayerAction = PlayerActionQueue | PlayerActionCurrentSong | PlayerActionPopulate

const initialState: PlayerState = {
  currentSong: null,
  queue: [],
}

export const PlayerContext = createContext<PlayerStore>({ state: initialState })

export const reducer = (
  state: PlayerState = initialState,
  action: PlayerAction
): PlayerState => {
  switch (action.type) {
    case PlayerActions.POPULATE:
      return action.payload
    case PlayerActions.SET_CURRENT_SONG:
      return {
        ...state,
        currentSong: action.song,
      }
    case PlayerActions.SET_QUEUE:
      return {
        ...state,
        queue: action.queue,
      }
    default:
      throw new Error(`Unknown action ${action}`);

  }
}

export const usePlayerContext = () => useContext(PlayerContext);

export const PlayerProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return <PlayerContext.Provider value={{ state, dispatch }} children={children} />;
}

export const getCurrentSong = (dispatch: (value: PlayerAction) => void) => {
  request(`query {
    player {
      currentSong {
        title
        album
        albumArt
        artist
        timeElapsed
        totalTime
      }
      queue {
        title
        album
        albumArt
        artist
        upvotes
        downvotes
      }
    }
  }`).then(({player}) => {
    dispatch({
      type: PlayerActions.POPULATE,
      payload: player,
    })
  })
}

export const subscribe = () => {
  const { dispatch } = usePlayerContext()

  useEffect(() => {
    apolloClient.subscribe({
      query: gql`
        subscription {
          onBroadcast {
            message
            type
          }
        }
      `
    }).subscribe(response => {
      if (response?.data?.onBroadcast) {
        toast[response.data.onBroadcast.type](response.data.onBroadcast.message, {
          hideProgressBar: true,
        })
      }
    })
  }, [])

  useEffect(() => {
    apolloClient.subscribe({
      query: gql`
        subscription {
          onPlayerUpdated {
            currentSong {
              title
              album
              albumArt
              artist
              timeElapsed
              totalTime
            }
            queue {
              title
              album
              albumArt
              artist
              upvotes
              downvotes
            }
          }
        }
      `
    }).subscribe(response => {
      if (response?.data?.onPlayerUpdated) {
        dispatch({
          type: PlayerActions.POPULATE,
          payload: response.data.onPlayerUpdated,
        })
      }
    })
  }, [])
}
