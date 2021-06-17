import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import React from 'react';
import { HomeContext, HomeStore } from '../../context/home';
import Styles from '../../styles/Home.module.scss';
import chroma from 'chroma-js'

type MyProps = {
  className?: string
}
export default class UVIndex extends React.Component<MyProps> {

  static contextType = HomeContext
  context: HomeStore

  render (className = '') {
    const {UVIndex} = this.context.state

    if (!UVIndex) {
      return null
    }

    const percentage = UVIndex.value * 10

    const color = chroma.scale(['yellow', 'red'])

    return (
      <div className={`${Styles.uvIndex} ${this.props.className}`}>
        <CircularProgressbarWithChildren value={percentage} strokeWidth={2} styles={buildStyles({
          pathColor: color(percentage / 100)
        })} >

          <div className={Styles.uvIndexUpdated}>
            {this.context.state.UVIndex.updatedAt.format('h:mm A')}
          </div>
          <div className={Styles.uvIndexNumber}>
            {this.context.state.UVIndex.value.toFixed(2)}
          </div>
          <div className={Styles.uvIndexDescription}>
            {this.context.state.UVIndex.description}
          </div>
        </CircularProgressbarWithChildren>
      </div>
    )
  }
}
