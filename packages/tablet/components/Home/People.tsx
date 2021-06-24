import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import React from 'react';
import { HomeContext, HomeStore } from '../../context/home';
import chroma from 'chroma-js'
import dayjs from 'dayjs'

type MyProps = {
  className?: string
}
export default class People extends React.Component<MyProps> {

  static contextType = HomeContext
  context: HomeStore

  render () {
    const homies = this.context.state.trackers.filter(tracker => tracker.state === 'home' && tracker.person !== 'unknown')
    let sun = <div></div>
    if (this.context.state.trackers) {
      sun = <div>
        {homies.map(homie => (
          <div key={homie.deviceName}>{homie.person} is here!</div>
        ))}
      </div>
    }

    return sun
  }
}
