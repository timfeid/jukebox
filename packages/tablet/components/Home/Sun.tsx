import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import React from 'react';
import { HomeContext, HomeStore } from '../../context/home';
import chroma from 'chroma-js'
import dayjs from 'dayjs'

type MyProps = {
  className?: string
}
export default class Sun extends React.Component<MyProps> {

  static contextType = HomeContext
  context: HomeStore

  render () {
    let sun = <div></div>
    if (this.context.state.sun) {
      const sunrise = this.context.state.sun.nextSunrise.subtract(1, 'd')
      const sunset = this.context.state.sun.nextSunset
      const percentage = 100 - (sunset.diff(dayjs()) / sunset.diff(sunrise) * 100)
      const color = chroma.scale('RdPu')
      sun = (
        <div style={{width: '175px'}} className={this.props.className}>
          <CircularProgressbarWithChildren value={percentage} strokeWidth={2} styles={buildStyles({
            pathColor: color(percentage / 100),
          })}>
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

    return sun
  }
}
