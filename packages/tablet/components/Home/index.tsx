import dayjs from 'dayjs';
import React from 'react';
import { HomeContext, HomeStore, useHomeContext } from '../../context/home';
import FlipClock from '../FlipClock';
import WeatherComponent from '../Weather';
import Queue from './Queue';
import WasherDryer from './WasherDryer';
import UVIndex from './UVIndex';
import Sun from './Sun';
import Tile from './Tile'
import { PlayerContext, PlayerStore, usePlayerContext } from '../../context/player.context';

export default HomeComponent => {
  const homeContext = useHomeContext()
  const playerContext = usePlayerContext()

  return (
    <div className="flex w-full h-full">
      <div className={`flex-grow grid grid-cols-${playerContext.state.queue.length ? 3 : 4} auto-rows-min`}>
        <Tile title="Time">
          <div className="text-5xl text-center leading-tight">
            {dayjs().format('MMM D')}<br />
            {dayjs().format('h:mmA')}
          </div>
        </Tile>
        <Tile title="Livingston"><WeatherComponent /></Tile>
        <Tile title="UV Index">
          <UVIndex />
        </Tile>
        <Tile title="Sun">

          <Sun />
        </Tile>
        {homeContext.state.washer && homeContext.state.washer.state === 'on' ? <Tile title="Washer">
          <WasherDryer type="washer" />
        </Tile> : null}
        {homeContext.state.dryer && homeContext.state.dryer.state === 'on' ? <Tile title="Dryer">
          <WasherDryer type="dryer" />
        </Tile> : null}
      </div>

      <Queue />
    </div>
  )
}
