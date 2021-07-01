import { useHomeContext } from "../context/home"
import WeatherIcon from "./WeatherIcon"
import chroma from 'chroma-js'
import Styles from '../styles/Weather.module.scss'

export default function WeatherComponent () {
  const { state } = useHomeContext()

  if (state.loading || !state.weather) {
    return null
  }

  let weather = state.weather.state
  weather = weather[0].toUpperCase() + weather.substring(1)

  const color = chroma.scale(['#b6d0fa', '#c5d9fb', '#d4e3fc', '#e3ecfd', '#f1f5fe', '#fff3f0', '#ffe6e1', '#fddad3', '#fccdc4', '#fac1b6'])

  function getTempColor(weather: number) {
    weather = Math.max(0, weather)
    weather = Math.min(100, weather)

    return color(weather / 100)
  }

  function temp(degrees: number) {
    return degrees.toFixed(0)
  }

  return (
    <div className={Styles.weather}>
      <div className={Styles.iconContainer}>
        <div className={Styles.icon}>
          <WeatherIcon
            title={state.weather.state}
            path={state.weather.icon}
            size={150}
          />
        </div>
        <div className={Styles.temperature}>
          {temp(state.weather.temperature)}&deg;
        </div>
      </div>
    </div>
  )
}
