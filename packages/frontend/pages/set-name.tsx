import Layout from '../components/Layout'
import debounce from 'debounce'
import { getCurrentUser, UserActions, useUserContext } from '../context/user.context'
import { useEffect } from 'react'
import { request } from '../fetcher/graphql'


export default function Home() {
  const { state, dispatch } = useUserContext()

  const setName = debounce(async (name: string) => {
    const response = await request(`
      mutation ($name: String!) {
        setUserName(name: $name) {
          name
          mac
        }
      }
    `, {
      name,
    })
    dispatch({
      type: UserActions.POPULATE,
      payload: response.setUserName,
    })
  }, 500)

  useEffect(() => {
    getCurrentUser(dispatch)
  }, [false])

  return (
    <Layout>
      <label>
        Name
        <input className="input-text" name="name" value={state.name} onChange={function (e) { setName(e.target.value) }} />
      </label>
      <label>
        MAC
        <input className="input-text" name="mac" value={state.mac} disabled />
      </label>
    </Layout>
  )
}
