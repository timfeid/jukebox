import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import React from 'react';
import { HomeContext, HomeStore } from '../../context/home';
import dayjs from 'dayjs'
import { FaAirFreshener, FaWater } from 'react-icons/fa';
import { GiHeatHaze } from 'react-icons/gi'
import { CgSmartHomeWashMachine } from 'react-icons/cg'

type MyProps = {
  type: 'washer' | 'dryer'
  className?: string
}
export default class WasherDryer extends React.Component<MyProps> {

  static contextType = HomeContext
  context: HomeStore

  render () {
    const appliance = this.context.state[this.props.type]

    if (appliance && appliance.state === 'on') {
      const completion = appliance.completionTime
      const percentage = Number (100 - (completion.diff(dayjs()) / completion.diff(appliance.stateChangedTime) * 100))
      const timeRemaining = appliance.completionTime.diff(dayjs(), 'minute')
      const icon = this.props.type === 'dryer' ? <GiHeatHaze /> : <CgSmartHomeWashMachine />
      return (
        <div style={{width: '175px'}} className={this.props.className}>
          <CircularProgressbarWithChildren strokeWidth={2} value={percentage}>
            <div className="text-3xl mb-1">
              {icon}
            </div>
            <div className="text-xl">
              {timeRemaining} MIN
            </div>
            <div>
              {appliance.cycle}
            </div>

          </CircularProgressbarWithChildren>
        </div>
      )
    }

    return <div></div>
  }
}
