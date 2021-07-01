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
      const sunriseScale = ['#00429d', '#2e59a8', '#4771b2', '#5d8abd', '#73a2c6', '#8abccf', '#a5d5d8', '#c5eddf', '#ffffe0']
      const sunsetScale = ['#faeda9', '#e3d5a9', '#cbbea9', '#b3a8a8', '#9a92a7', '#817ca5', '#6568a3', '#4454a0', '#00429d']
      const color = chroma.scale(this.context.state.sun.isDaytime ? sunsetScale : sunriseScale)

      sun = (
        <div style={{width: '135px'}} className={this.props.className}>
          <CircularProgressbarWithChildren value={percentage} strokeWidth={2} styles={buildStyles({
            pathColor: color(percentage / 100),
          })}>
            <div className="text-md">
              {this.context.state.sun.isDaytime ? 'Sunset' : 'Sunrise'} at
            </div>
            <div className="text-xl">
              {this.context.state.sun.isDaytime ? sunset.format('hh:mmA') : sunrise.format('hh:mmA')}
            </div>

          </CircularProgressbarWithChildren>
        </div>
      )
    }

    return sun
  }
}
