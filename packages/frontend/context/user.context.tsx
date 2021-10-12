import { createContext, Dispatch, useContext, useReducer } from 'react'
import { request } from '../fetcher/graphql'

type UserStore = {
  state: UserState
  dispatch?: Dispatch<UserAction>
}

export type UserState = {
  name: string
  mac: string
}

export enum UserActions {
  POPULATE = 'POPULATE',
}

type UserActionPopulate = {
  type: UserActions.POPULATE,
  payload: UserState,
}

export type UserAction = UserActionPopulate // | Another1

const initialState: UserState = {
  name: '',
  mac: '',
}

export const UserContext = createContext<UserStore>({ state: initialState })

export const reducer = (
  state: UserState = initialState,
  action: UserAction
): UserState => {
  switch (action.type) {
    case UserActions.POPULATE:
      return action.payload
    default:
      throw new Error(`Unknown action ${action}`);

  }
}

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return <UserContext.Provider value={{ state, dispatch }} children={children} />;
}

export const getCurrentUser = (dispatch: (value: UserAction) => void) => {
  request(`query {
    user {
      name
      mac
    }
  }`).then(({user}) => {
    console.log(user)
    dispatch({
      type: UserActions.POPULATE,
      payload: user,
    })
  })
}
