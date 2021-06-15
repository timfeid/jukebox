import React from 'react';
import { HomeContext, HomeStore } from '../../context/home';
import Styles from '../../styles/Home.module.scss';

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

    return (
      <div className={`${Styles.uvIndex} ${this.props.className}`}>
        <div className={Styles.uvIndexUpdated}>
          {this.context.state.UVIndex.updatedAt.format('h:mm A')}
        </div>
        <div className={Styles.uvIndexNumber}>
          {this.context.state.UVIndex.value.toFixed(2)}
        </div>
        <div className={Styles.uvIndexDescription}>
          {this.context.state.UVIndex.description}
        </div>
      </div>
    )
  }
}
