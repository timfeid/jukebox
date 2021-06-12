import React from 'react';
import { PlayerContext, PlayerStore } from '../../context/player.context';
import Styles from '../../styles/Home.module.scss';
import SongCard from '../SongCard';

export default class Queue extends React.Component {

  static contextType = PlayerContext
  context: PlayerStore

  songCards () {
    const {queue} = this.context.state

    return queue.map((song, key) => {
      return <SongCard {...song} key={key} className={"mb-3"} />
    })
  }

  render () {
    const {queue} = this.context.state

    if (!queue.length) {
      return null
    }

    return (
      <div className={Styles.queue}>
        <h1 className="text-xl mb-3 font-alt">On deck</h1>
        {this.songCards()}
      </div>
    )
  }
}
