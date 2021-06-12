import dayjs from 'dayjs';
import React from 'react';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import { HomeContext, HomeStore } from '../../context/home';
import FlipClock from '../FlipClock';
import WeatherComponent from '../Weather';
import Queue from './Queue';
import UVIndex from './UVIndex';

export default class Home extends React.Component {
  static contextType = HomeContext
  context: HomeStore
  render () {

    let sun = <div></div>
    if (this.context.state.sun) {
      const sunrise = this.context.state.sun.nextSunrise.subtract(1, 'd')
      const sunset = this.context.state.sun.nextSunset
      const percentage = sunset.diff(dayjs()) / sunset.diff(sunrise) * 100
      sun = (
        <div style={{width: '200px'}}>
          <CircularProgressbarWithChildren value={percentage}>
            <div className="text-md">
              {this.context.state.sun.isDaytime ? 'Sunset' : 'Sunrise'}
            </div>
            <div className="text-2xl">
              {sunset.format('hh:mmA')}
            </div>

          </CircularProgressbarWithChildren>
        </div>
      )
    }

    return (
      <div className="flex w-full">
        <div className="flex-grow flex flex-wrap items-center justify-center">
          <div>
            <FlipClock />
          </div>
          <div className="flex flex-col items-center justify-center mt-12">
            <WeatherComponent />
          </div>
          <div className="flex flex-col items-center justify-center mt-12">
            <UVIndex />
          </div>
          <div className="flex flex-col items-center justify-center mt-12">
            {/* <pre>
              {JSON.stringify(this.context.state.sun, null, 2)}
            </pre> */}
            {sun}
          </div>
        </div>

        <Queue />
      </div>
    )
  }
}
