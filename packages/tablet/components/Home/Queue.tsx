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
      return <div><SongCard {...song} key={key} className={"mb-3"} /></div>
    })
  }

  render () {
    const {queue} = this.context.state

    if (!queue.length) {
      return null
    }

    return (
      <div className="w-10/12">
        {this.songCards()}
      </div>
    )
  }
}
