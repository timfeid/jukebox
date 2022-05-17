import type { Component } from 'solid-js';
import { For } from 'solid-js'
import Search from './components/Search';
import styles from './css/Layout.module.scss';
import NowPlaying from './components/NowPlaying'
import { queue } from './store';
import SongCard from './components/SongCard';

const App: Component = () => {
  return (
    <div class={styles.container}>
      <div class={styles.header}>
        <div class={styles.headerContainer}>
          <Search />
        </div>

      </div>
      <div class={styles.main}>
        <div style={{maxWidth: "36rem"}}>
          <For each={queue()}>
            {song => <SongCard {...song}></SongCard>}
          </For>
        </div>
      </div>
      <NowPlaying />
    </div>
  );
};

export default App;
