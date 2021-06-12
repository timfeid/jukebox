import { useHomeContext } from "../context/home"
import WeatherIcon from "./WeatherIcon"

export default function WeatherComponent () {
  const { state } = useHomeContext()

  if (state.loading || !state.weather) {
    return null
  }

  let weather = state.weather.state
  weather = weather[0].toUpperCase() + weather.substring(1)

  return (
    <div className="text-center">
      <div className="text-3xl">Livingston, NJ</div>
        <WeatherIcon
          title={state.weather.state}
          path={state.weather.icon}
          size={220}
        />
        <div className="text-xl">
          {weather}, {state.weather.temperature} &deg;{state.weather.unit}
        </div>
        <div>
          {false}
        </div>
        <div>
          {state.weather.humidity}% humidity
        </div>
        <div>
          {state.weather.windDirection} @ {state.weather.windSpeed}mph
        </div>
    </div>
  )
}
