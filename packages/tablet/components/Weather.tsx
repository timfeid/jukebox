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
    <div className="flex items-center flex-col">
      <div className="text-3xl">Livingston, NJ</div>
        <WeatherIcon
          title={state.weather.state}
          path={state.weather.icon}
          size={100}
        />
        <div className="text-3xl">{state.weather.temperature}&deg;{state.weather.unit}</div>
        <div className="text-xl mt-3">
          {weather}
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
