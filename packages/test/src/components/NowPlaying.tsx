import styles from '../css/NowPlaying.module.scss'
import { currentSong } from '../store'
import SongCard from './SongCard'
import { Show, createSignal, createEffect } from 'solid-js'

export default function NowPlaying() {
  const [width, setWidth] = createSignal(0)

  createEffect(() => {
    setWidth(!currentSong() ? 0 : (currentSong().totalTime === 0
      ? 0
      : (currentSong().timeElapsed / currentSong().totalTime * 100)))
  })

  return <Show when={currentSong()}>
    <div>{JSON.stringify(currentSong())}</div>
    <div class={styles.nowPlaying}>
      <div class={styles.progressContainer}>
        <div class={styles.progressBar} style={{width: `${width()}%`}}></div>
      </div>
      <div class={styles.nowPlayingContainer}>
        <SongCard {...currentSong()} className={styles.nowPlayingCard} />
      </div>
    </div>
  </Show>
}
