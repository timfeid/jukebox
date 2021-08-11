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

  const daysOfTheWeek = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
  ]

  return (
    <div className="flex w-full h-full items-center">
      <div className={`flex-grow grid grid-cols-4 ${playerContext.state.queue.length > 0 ? 'grid-rows-3' : 'auto-rows-fr'}`}>
        {playerContext.state.currentSong && <Tile rowSpan={2} title="Now Playing">
          <NowPlaying />
        </Tile>}
        <Tile title="Time">
          <div className="text-4xl text-center leading-tight flex items-center justify-center">
            {daysOfTheWeek[dayjs().day()]}, {dayjs().format('MMM D')}<br />
            {dayjs().format('h:mmA')}
          </div>
        </Tile>
        <Tile title="Livingston"><WeatherComponent /></Tile>
        {playerContext.state.queue && playerContext.state.queue.length > 0 && <Tile title="Queue" rowSpan={3}>
          <Queue />

        </Tile>}
        {homeContext.state.sun?.isDaytime ? <Tile title="UV Index">
          <UVIndex className="m-auto" />
        </Tile> : null}

        <Tile title="Sun">

          <Sun className="m-auto" />
        </Tile>
        {homeContext.state.washer && homeContext.state.washer.state === 'on' ? <Tile title="Washer">
          <WasherDryer type="washer" className="m-auto" />
        </Tile> : null}
        {homeContext.state.dryer && homeContext.state.dryer.state === 'on' ? <Tile title="Dryer">
          <WasherDryer type="dryer" className="m-auto" />
        </Tile> : null}
        <Tile title="People">
          <People />
        </Tile>
        <Tile title="Jukebox">
          <div className="m-auto rounded-lg" style={{background: 'white', padding: '.5rem', marginTop: '.5rem'}}>
            <img src="/qrcode.png" style={{width: 120, height: 120}} />
          </div>
        </Tile>
      </div>

    </div>
  )
}

export default HomeComponent
