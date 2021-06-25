import dayjs from 'dayjs';
import React from 'react';
import { useHomeContext } from '../../context/home';
import { usePlayerContext } from '../../context/player.context';
import WeatherComponent from '../Weather';
import NowPlaying from './NowPlaying';
import People from './People';
import Queue from './Queue';
import Sun from './Sun';
import Tile from './Tile';
import UVIndex from './UVIndex';
import WasherDryer from './WasherDryer';

const HomeComponent = () => {
  const homeContext = useHomeContext()
  const playerContext = usePlayerContext()

  return (
    <div className="flex w-full h-full items-center">
      <div className={`flex-grow grid grid-cols-${playerContext.state.queue.length ? 3 : 4} auto-rows-fr`}>
        {playerContext.state.currentSong && <Tile title="Now Playing">
          <NowPlaying />
        </Tile>}
        <Tile title="Time">
          <div className="text-5xl text-center leading-tight">
            {dayjs().format('MMM D')}<br />
            {dayjs().format('h:mmA')}
          </div>
        </Tile>
        <Tile title="Livingston"><WeatherComponent /></Tile>
        {homeContext.state.sun?.isDaytime ? <Tile title="UV Index">
          <UVIndex />
        </Tile> : null}
        <Tile title="Sun">

          <Sun />
        </Tile>
        {homeContext.state.washer && homeContext.state.washer.state === 'on' ? <Tile title="Washer">
          <WasherDryer type="washer" />
        </Tile> : null}
        {homeContext.state.dryer && homeContext.state.dryer.state === 'on' ? <Tile title="Dryer">
          <WasherDryer type="dryer" />
        </Tile> : null}
        <Tile title="People">
          <People />
        </Tile>
      </div>

      <Queue />
    </div>
  )
}

export default HomeComponent
