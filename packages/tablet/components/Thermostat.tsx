import { gql, useSubscription } from '@apollo/client'
import { useEffect } from 'react'
import { request } from '../fetcher/graphql'
import NowPlaying from './NowPlaying'
import { Thermostat, useHomeContext } from '../context/home'
import Nest from 'react-nest-thermostat'
import Styles from '../styles/Thermostat.module.scss'

const Layout = ({hvacMode, mode, currentTemperature, setTemperature, name}: Thermostat) => {
  return <div className={Styles.thermostat}>
    <div>
      <span className="text-xl">{name}</span>
    </div>
    <div>
      <Nest ambientTemperature={currentTemperature} targetTemperature={setTemperature} hvacMode={hvacMode}>
        {name} -
        {hvacMode} -
        currently {currentTemperature} set to {setTemperature}
      </Nest>
    </div>
  </div>
}

export default Layout
