import dayjs from 'dayjs';
import React from 'react';
import { HomeContext, HomeStore } from '../../context/home';
import FlipClock from '../FlipClock';
import WeatherComponent from '../Weather';
import Queue from './Queue';
import WasherDryer from './WasherDryer';
import UVIndex from './UVIndex';
import Sun from './Sun';

export default class Home extends React.Component {
  static contextType = HomeContext
  context: HomeStore
  render () {



    return (
      <div className="flex w-full h-full">
        <div className="flex-grow flex flex-col flex-wrap items-center justify-between">
          <div>
            <FlipClock />
          </div>
          <div className="flex flex-col items-center justify-center">
            <WeatherComponent />
          </div>
          <div className="flex items-center justify-center">
            <UVIndex className="mr-5" />
            <Sun className="mr-5" />
            <WasherDryer className="mr-5" type="washer" />
            <WasherDryer className="mr-5" type="dryer" />
          </div>
        </div>

        <Queue />
      </div>
    )
  }
}
