import React from 'react';
import { HomeContext, HomeStore } from '../../context/home';
import Styles from '../../styles/Home.module.scss';

export default class UVIndex extends React.Component {

  static contextType = HomeContext
  context: HomeStore

  render () {
    const {UVIndex} = this.context.state

    if (!UVIndex) {
      return null
    }

    return (
      <div className={Styles.uvIndex}>
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
