import { useState } from "react";
import { FaHome, FaMusic } from 'react-icons/fa';
import SwipableViews from 'react-swipeable-views';
import Home from "../components/Home";
import NowPlaying from "../components/NowPlaying";
import Player from '../components/Player';
import Thermostat from '../components/Thermostat';
import { useHomeContext } from '../context/home';
import layout from '../styles/Layout.module.scss';

export default function index() {

  const home = useHomeContext()

  const [index, setIndex] = useState(0)

  const styles = {
    slideStyle: {
      width: '100%',
      height: '100%',
    },
    hello: {
      width: '100%',
      height: '100%',
    },

    containerStyle: {
      width: '100%',
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
          style={styles.hello}
          slideStyle={styles.slideStyle}
          containerStyle={styles.containerStyle}
          onChangeIndex={index => setIndex(index)}
        >
          <Home />
          <Player />
        </SwipableViews>
      </div>
      <NowPlaying />
    </div>
  );
}