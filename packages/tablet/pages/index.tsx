import { Component, createContext, useContext, useState } from "react"
import WeatherIcon from "../components/WeatherIcon";
import SwipableViews from 'react-swipeable-views'
import layout from '../styles/Layout.module.scss'
import NowPlaying from "../components/NowPlaying";
import Player from '../components/Player'
import Thermostat from '../components/Thermostat'
import {FaHome, FaMusic} from 'react-icons/fa'
import { subscribe, useHomeContext } from '../context/home'
import FlipClock from '../components/FlipClock'
import Weather from '../components/Weather'

export default function index() {

  const home = useHomeContext()

  const [index, setIndex] = useState(0)

  const styles = {
    slideStyle: {
      height: '100%',
    },
    containerStyle: {
      height: '100%',
    },
    slide: {
      width: '100%',
      height: '100vh',
    },
    navButton: {
      marginBottom: '1rem',
      width: '2rem',
    }
  }

  function styleForNavIndex(i) {
    if (i === index) {
      return {
        ...styles.navButton,
        opacity: 1
      }
    }

    return {
      ...styles.navButton,
      opacity: .5,
    }
  }

  function theromstats() {
    // return null
    return home.state.thermostats.map(theromstat => (
      <div className="flex flex-col items-center justify-center">
        <Thermostat key={theromstat.name} {...theromstat} />
      </div>
    ))
  }

  return (
    <div className="flex">
      <div className={layout.nav}>
        <div>
          <FaHome size="24" style={styleForNavIndex(0)} />
          <FaMusic size="24" style={styleForNavIndex(1)} />
        </div>
      </div>
      <div className={layout.container}>

        <SwipableViews
          axis="y"
          slideStyle={styles.slideStyle}
          containerStyle={styles.containerStyle}
          onChangeIndex={index => setIndex(index)}
          ignoreNativeScroll
        >
          <div className="grid grid-cols-3 items-center justify-center">

            <div>
              <FlipClock />
            </div>
            <div className="flex flex-col items-center justify-center mt-12">
              <Weather />
            </div>
            {theromstats()}
            <pre>
              {false ? JSON.stringify(data, null, 2) : ''}
            </pre>
          </div>
          <div>
            <Player />
          </div>
        </SwipableViews>
      </div>
      <NowPlaying />
    </div>
  );
}
