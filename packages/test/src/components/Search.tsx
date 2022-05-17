import styles from '../css/Search.module.scss'
import { gql } from 'graphql-request'
import { request } from '../request'
import { createResource, createSignal, Show, Suspense, For } from 'solid-js'
import createDebounce from '@solid-primitives/debounce'
import SongCard from './SongCard'

export default function Search () {
  const [search, setSearch] = createSignal('')

  const delayedSetSearch = createDebounce((val) => setSearch(val), 500)

  const [results] = createResource<any[], string>(search, async (search) => {
    if (!search) {
      return Promise.resolve([])
    }

    const data = await request(gql`query($search: String!) {
      search(input: $search) {
        youtubeId
        title
        album
        albumArt
        artist
      }
    }`, {search})

    return data.search
  })

  const addSongToQueue = async (song) => {
    setSearch('')

    await request(gql`mutation($artist: String!, $album: String!, $albumArt: String!, $title: String!, $youtubeId: String!) {
      play(artist: $artist, album: $album, albumArt: $albumArt, title: $title, youtubeId: $youtubeId) {
        currentSong {
          youtubeId
          title
          album
          albumArt
          artist
        }
      }
    }`, song)

  }

  return (
    <div class={styles.searchContainer}>
      <form onSubmit={delayedSetSearch.clear} class={styles.searchForm}>
        <input
          placeholder="Search music"
          class={`input-text`}
          type="text"
          value={search()}
          onInput={(e) => delayedSetSearch(e.currentTarget.value)}
        />
      </form>

      <div>
        <Suspense fallback={<div class="pl-4 pt-2">...</div>}>
          <Show when={results()}>
            <For each={results()}>
              {(result) => (
                <div
                  onClick={() => addSongToQueue(result)}
                  class={`cursor-pointer ${styles.searchResultsItem}`}
                >
                  <SongCard {...result} />
                </div>
              )}
            </For>
          </Show>
        </Suspense>
      </div>
    </div>
  )
}
