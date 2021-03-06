import styles from '../css/Search.module.scss'
import { gql } from 'graphql-request'
import { request } from '../request'
import { createResource, createSignal, Show, Suspense, For } from 'solid-js'
import createDebounce from '@solid-primitives/debounce'
import SongCard from './SongCard'
import { FaSolidSearch } from 'solid-icons/fa'

export default function Search () {
  const [search, setSearch] = createSignal('')
  const [results, setResults] = createSignal([])

  const delayedSetSearch = createDebounce((val) => setSearch(val), 500)

  const [suggestions] = createResource<any[], string>(search, async (search) => {
    if (!search) {
      return Promise.resolve([])
    }

    const data = await request(gql`query($input: String!) {
      suggestions(input: $input) {
        runs {
          text
          bold
        }
        query
      }
    }`, {input: search})

    return data.suggestions
  })

  const performSearch = async (e?: SubmitEvent) => {
    if (e) {
      e.preventDefault()
    }

    delayedSetSearch.clear()

    request(gql`query($search: String!) {
      search(input: $search) {
        youtubeId
        title
        album
        albumArt
        artist
      }
    }`, {search: search()}).then(data => setResults(data.search))

    setSearch('')
  }

  const addSongToQueue = async (song) => {
    setSearch('')
    setResults([])

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

  const setAndSearch = (val) => {
    setSearch(val)
    performSearch()
  }

  return (
    <div class={styles.searchContainer}>
      <form onSubmit={performSearch} class={styles.searchForm}>
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

      <Show when={suggestions() && suggestions().length > 0}>
        <div class={styles.searchSuggestions}>
          <For each={suggestions()}>
            {suggestion => (
              <div class={styles.searchSuggestionsItem} onClick={() => setAndSearch(suggestion.query)}>
                <FaSolidSearch class="mr-4" />
                <div>
                  {suggestion.runs.map(run => {
                    return run.bold ? <strong>{run.text}</strong> : <span>{run.text}</span>
                  })}
                </div>
              </div>
            )}
          </For>
        </div>
      </Show>
    </div>
  )
}
