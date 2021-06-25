import React from 'react';
import { PlayerContext, PlayerStore } from '../../context/player.context';
import Styles from '../../styles/Home.module.scss';

export default class NowPlaying extends React.Component {

  static contextType = PlayerContext
  context: PlayerStore

  render () {
    let albumArt = this.context.state.currentSong.albumArt
    albumArt = albumArt ? albumArt.replace(/w120-h120/, 'w135-h135') : ''
    return (
      <div className="w-full h-full flex flex-col items-center pt-4">
        <div className="flex-grow flex items-center flex-col">
          <img className="object-contain" src={albumArt} />
          <div className="text-xl font-bold pt-3 whitespace-nowrap overflow-hidden overflow-ellipsis" style={{maxWidth: '70%'}}>
            {this.context.state.currentSong.title}
          </div>
          <div className="text-xl font-light whitespace-nowrap overflow-hidden overflow-ellipsis" style={{maxWidth: '70%'}}>
            {this.context.state.currentSong.artist}
          </div>
        </div>
        <div className={Styles.progressContainer}>
          <div className={Styles.progressBar} style={{width: `${this.context.state.currentSong.progress}%`}}></div>
        </div>
      </div>
    )
  }
}
